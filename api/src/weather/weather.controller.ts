import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CurrentWeatherResponse } from '../open-weather/open-weather.service';
import { WeatherService } from './weather.service';

type CurrentWeatherQueryParams = { latitude?: string, longitude?: string, zipCode?: string, cityState?: string };

@Controller('/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/current')
  getCurrentWeather(@Query() query: CurrentWeatherQueryParams): Promise<CurrentWeatherResponse> {
    if (query.latitude && query.longitude) {
      return this.weatherService.getCurrentWeatherFromLatitudeLongitude(query.latitude, query.longitude);
    } else if (query.zipCode) {
      return this.weatherService.getCurrentWeatherFromZipCode(query.zipCode);
    } else if (query.cityState) {
      return this.weatherService.getCurrentWeatherFromCityState(query.cityState);
    } else {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
