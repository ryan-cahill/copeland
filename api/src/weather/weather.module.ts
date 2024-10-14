import { Module } from '@nestjs/common';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { OpenWeatherMapModule } from '../open-weather/open-weather.module';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [GeocodingModule, OpenWeatherMapModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
