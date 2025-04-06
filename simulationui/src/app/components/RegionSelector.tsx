/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface Region {
  id: number;
  name: string;
  bounds: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
  center: [number, number];
}

interface RegionSelectorProps {
  onSelect: (region: Region) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ onSelect }) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Запрос Overpass для получения регионов Москвы
    const query = `[out:json][timeout:50];
// Moscow bounding box
(
  relation["boundary"="administrative"]["admin_level"="8"]["name:ru"](55.136682,36.800777,56.018397,37.96386);
);
out body;
>;
out skel qt;`;

    setLoading(true);
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        // Фильтруем элементы: выбираем только relation с полем bounds
        const elems = data.elements.filter((el: any) => el.type === 'relation' && el.tags && el.bounds);
        const parsed: Region[] = elems.map((el: any) => {
          const { id, tags, bounds } = el;
          const name = tags['name:ru'] || tags.name || `Region ${id}`;
          const center: [number, number] = [
            (bounds.minlat + bounds.maxlat) / 2,
            (bounds.minlon + bounds.maxlon) / 2,
          ];
          return {
            id,
            name,
            bounds,
            center,
          };
        });
        setRegions(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mb-4">
      {loading && <p>Загрузка регионов...</p>}
      {!loading && regions.length > 0 && (
        <select
          className="border border-gray-300 rounded p-2"
          onChange={(e) => {
            const regionId = Number(e.target.value);
            const region = regions.find((r) => r.id === regionId);
            if (region) {
              onSelect(region);
            }
          }}
        >
          <option value="">Выберите регион Москвы</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default RegionSelector;

