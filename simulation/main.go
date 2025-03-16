package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"sync"
)

type OSRMResponse struct {
	Code   string `json:"code"`
	Routes []struct {
		Duration float64 `json:"duration"`
		Distance float64 `json:"distance"`
	} `json:"routes"`
}

type Shipment struct {
	OriginLat   float64 `json:"originLat"`
	OriginLon   float64 `json:"originLon"`
	DestLat     float64 `json:"destLat"`
	DestLon     float64 `json:"destLon"`
	Description string  `json:"description"`
}

type RouteEntry struct {
	DistanceKM  float64 `json:"distance_km"`
	DurationMin float64 `json:"duration_min"`
}

type ShipmentResult struct {
	Description string       `json:"description"`
	Routes      []RouteEntry `json:"routes"`
	Error       string       `json:"error,omitempty"`
}

func getRoutes(lat1, lon1, lat2, lon2 float64) (OSRMResponse, error) {
	url := fmt.Sprintf("http://router.project-osrm.org/route/v1/driving/%.6f,%.6f;%.6f,%.6f?overview=false&alternatives=3", lon1, lat1, lon2, lat2)
	resp, err := http.Get(url)
	if err != nil {
		return OSRMResponse{}, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return OSRMResponse{}, err
	}

	var osrmResp OSRMResponse
	err = json.Unmarshal(body, &osrmResp)
	if err != nil {
		return OSRMResponse{}, err
	}
	return osrmResp, nil
}

func simulateBatchHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не поддерживается, используйте POST", http.StatusMethodNotAllowed)
		return
	}

	var shipments []Shipment
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Ошибка чтения запроса", http.StatusBadRequest)
		return
	}
	err = json.Unmarshal(body, &shipments)
	if err != nil {
		http.Error(w, "Ошибка парсинга JSON", http.StatusBadRequest)
		return
	}

	results := make([]ShipmentResult, len(shipments))
	var wg sync.WaitGroup

	for i, shipment := range shipments {
		wg.Add(1)
		go func(i int, shipment Shipment) {
			defer wg.Done()
			osrmResp, err := getRoutes(shipment.OriginLat, shipment.OriginLon, shipment.DestLat, shipment.DestLon)
			if err != nil {
				results[i] = ShipmentResult{Description: shipment.Description, Error: err.Error()}
				return
			}
			if osrmResp.Code != "Ok" || len(osrmResp.Routes) == 0 {
				results[i] = ShipmentResult{Description: shipment.Description, Error: "Маршрут не найден"}
				return
			}
			var routeEntries []RouteEntry
			for _, route := range osrmResp.Routes {
				routeEntries = append(routeEntries, RouteEntry{
					DistanceKM:  route.Distance / 1000, // перевод в км
					DurationMin: route.Duration / 60,   // перевод в минуты
				})
			}
			desiredRoutes := 10
			if len(routeEntries) > 0 && len(routeEntries) < desiredRoutes {
				base := routeEntries[0]
				for j := len(routeEntries); j < desiredRoutes; j++ {
					noiseFactor := 1 + (rand.Float64()*0.1 - 0.05)
					simulatedRoute := RouteEntry{
						DistanceKM:  base.DistanceKM * noiseFactor,
						DurationMin: base.DurationMin * noiseFactor,
					}
					routeEntries = append(routeEntries, simulatedRoute)
				}
			}
			results[i] = ShipmentResult{
				Description: shipment.Description,
				Routes:      routeEntries,
			}
		}(i, shipment)
	}
	wg.Wait()

	w.Header().Set("Content-Type", "application/json")
	jsonResp, err := json.Marshal(results)
	if err != nil {
		http.Error(w, "Ошибка формирования JSON ответа", http.StatusInternalServerError)
		return
	}
	w.Write(jsonResp)
}

func main() {
	http.HandleFunc("/simulate", simulateBatchHandler)
	fmt.Println("Сервер запущен на порту 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
