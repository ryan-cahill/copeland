import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

export interface CurrentWeatherResponse {
  coord: { lon: number, lat: number },
  weather: [ { id: number, main: string, description: string, icon: string } ],
  base: string,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number
  },
  visibility: number,
  wind: { speed: number, deg: number },
  clouds: { all: number },
  dt: number,
  sys: {
    type: number,
    id: number,
    country: string, // country code ex. US
    sunrise: number,
    sunset: number
  },
  timezone: number,
  id: number,
  name: string, // city/town name ex. North Lakeville
  cod: number
}

interface ZipCodeGeocodingResponse {
  zip: string,
  name: string,
  lat: number,
  lon: number,
  country: string;
}

interface CityGeocodingResponse {
  name: string,
  local_names: { [s: string]: string },
  lat: number,
  lon: number,
  country: string,
  state: string
}

@Injectable()
export class OpenWeatherMapService {
  openWeatherAppId;
  constructor() {
    this.openWeatherAppId = process.env.OPENWEATHERMAP_APP_ID;
  }

  /**
   * Send a request to the OpenWeather API
   * @param url is the complete url to use when making the request to the OpenWeather API
   * @returns the response from the specific API endpoint used
   */
  private async sendOpenweatherapiRequest(url: string): Promise<any> {
    try {
      return await axios(url);
    } catch (err) {
      if (err.response.data?.cod === 401) { // Unable to authenticate with the openweatherapi API
        throw new HttpException('Could not complete the request.', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      throw new HttpException(err.response.data.message, err.response.data.cod);
    }
  }

  /**
   * Construct the URL and make the request for the current weather to the OpenWeather API
   * @param query is a dictionary of query parameters to use when querying the OpenWeather API
   * @returns data about the current weather of the location supplied in the query parameters
   */
  private async sendWeatherRequest(query: { [s: string]: string }): Promise<CurrentWeatherResponse> {
    query.appid = this.openWeatherAppId;
    query.units = 'imperial';
    const queryParams = new URLSearchParams(query);

    const open_weather_api_response = await this.sendOpenweatherapiRequest(`https://api.openweathermap.org/data/2.5/weather?${queryParams}`); 
    return open_weather_api_response.data;
  }

  /**
   * Construct the URL and make the request for a location to the OpenWeather API
   * @param endpoint is the specific OpenWeather API endpoint to use
   * @param query is a dictionary of query parameters to use when querying the OpenWeather API
   * @returns data about the location supplied in the query parameters
   */
  private async sendGeocodingRequest(endpoint: string, query: { [s: string]: string }): Promise<ZipCodeGeocodingResponse | CityGeocodingResponse[]> {
    query.appid = this.openWeatherAppId; 
    query.units = 'imperial';
    const queryParams = new URLSearchParams(query);

    const open_weather_api_response = await this.sendOpenweatherapiRequest(`http://api.openweathermap.org/geo/1.0/${endpoint}?${queryParams}`);
    return open_weather_api_response.data;
  }

  async getCurrentWeatherFromLatitudeLongitude(latitude: string, longitude: string): Promise<CurrentWeatherResponse> {
    return this.sendWeatherRequest({ lat: latitude, lon: longitude });
  }

  async getLocationFromZipCode(zipCode: string): Promise<{ latitude: string, longitude: string }> {
    const locationData = (await this.sendGeocodingRequest('zip', { zip: `${zipCode},US` })) as ZipCodeGeocodingResponse;
    return { latitude: locationData.lat.toString(), longitude: locationData.lon.toString() };
  }

  async getLocationFromCityStateName(city: string, state?: string): Promise<{ latitude: string, longitude: string }> {
    const locationData = (await this.sendGeocodingRequest('direct', { q: `${[city, state].join(',')},US`, limit: '1' })) as CityGeocodingResponse[]; 
    if (!locationData.length) {
      throw new HttpException('The location was not found within the United States.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const firstLocationListed = locationData[0];
    return { latitude: firstLocationListed.lat.toString(), longitude: firstLocationListed.lon.toString() };
  }
}
