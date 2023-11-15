import { Module } from '@nestjs/common';
import { OpenWeatherMapService } from './open-weather.service';

@Module({
  imports: [],
  controllers: [],
  exports: [OpenWeatherMapService],
  providers: [OpenWeatherMapService],
})
export class OpenWeatherMapModule {}
