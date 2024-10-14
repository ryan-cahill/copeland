import { Module } from '@nestjs/common';
import { OpenWeatherMapModule } from '../open-weather/open-weather.module';
import { GeocodingService } from './geocoding.service';

@Module({
  imports: [OpenWeatherMapModule],
  controllers: [],
  exports: [GeocodingService],
  providers: [GeocodingService],
})
export class GeocodingModule {}
