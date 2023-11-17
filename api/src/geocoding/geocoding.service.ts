import { Injectable } from '@nestjs/common';
import { OpenWeatherMapService } from 'src/open-weather/open-weather.service';

@Injectable()
export class GeocodingService {
  constructor(
    private readonly openWeatherMapService: OpenWeatherMapService
  ) {}

  async getLocationFromZipCode(zipCode: string): Promise<{ latitude: string, longitude: string }> {
    return this.openWeatherMapService.getLocationFromZipCode(zipCode);
  }

  async getLocationFromCityStateName(cityStateName: string): Promise<{ latitude: string, longitude: string }> {
    const [city, state] = cityStateName.trim().split(','); // trim whitespace that might have been supplied in the request before forwarding to the OpenWeather API
    return this.openWeatherMapService.getLocationFromCityStateName(city, state);
  }
}
