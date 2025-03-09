-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "cargoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "driverId" INTEGER,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Truck" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "plate" TEXT NOT NULL,

    CONSTRAINT "Truck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_key" ON "Driver"("license");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_plate_key" ON "Truck"("plate");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
