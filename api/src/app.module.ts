import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CargoModule } from './cargo/cargo.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { DriverService } from './driver/driver.service';
import { DriverController } from './driver/driver.controller';
import { DriverModule } from './driver/driver.module';
import { TruckModule } from './truck/truck.module';
import { RouteModule } from './route/route.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    CargoModule,
    PrismaModule,
    UserModule,
    OrderModule,
    DriverModule,
    TruckModule,
    RouteModule,
  ],
  controllers: [AppController, DriverController],
  providers: [AppService, DriverService],
})
export class AppModule {}
