import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { OpenWeatherMapModule } from 'src/open-weather/open-weather.module';

@Module({
  imports: [OpenWeatherMapModule],
  controllers: [],
  exports: [GeocodingService],
  providers: [GeocodingService],
})
export class GeocodingModule {}
