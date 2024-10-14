import { Injectable } from '@nestjs/common';
import { GeocodingService } from '../geocoding/geocoding.service';
import { CurrentWeatherResponse, OpenWeatherMapService } from '../open-weather/open-weather.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly geocodingService: GeocodingService,
    private readonly openWeatherService: OpenWeatherMapService 
  ) {}

  async getCurrentWeatherFromLatitudeLongitude(latitude: string, longitude: string): Promise<CurrentWeatherResponse> { 
    return this.openWeatherService.getCurrentWeatherFromLatitudeLongitude(latitude, longitude);
  }

  async getCurrentWeatherFromZipCode(zipCode: string): Promise<CurrentWeatherResponse> {
    const latitudeAndLongitude = await this.geocodingService.getLocationFromZipCode(zipCode);
    return this.openWeatherService.getCurrentWeatherFromLatitudeLongitude(latitudeAndLongitude.latitude, latitudeAndLongitude.longitude);
  }

  async getCurrentWeatherFromCityState(cityStateName: string): Promise<CurrentWeatherResponse> {
    const latitudeAndLongitude = await this.geocodingService.getLocationFromCityStateName(cityStateName);
    return this.openWeatherService.getCurrentWeatherFromLatitudeLongitude(latitudeAndLongitude.latitude, latitudeAndLongitude.longitude);
  }
}
