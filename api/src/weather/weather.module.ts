import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { GeocodingModule } from 'src/geocoding/geocoding.module';
import { OpenWeatherMapModule } from 'src/open-weather/open-weather.module';

@Module({
  imports: [GeocodingModule, OpenWeatherMapModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
