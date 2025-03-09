-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
