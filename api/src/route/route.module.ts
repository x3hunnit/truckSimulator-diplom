import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';

@Module({
  imports: [HttpModule], // для запросов к внешним API
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
