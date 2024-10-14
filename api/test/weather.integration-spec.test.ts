import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { OpenWeatherMapModule } from '../src/open-weather/open-weather.module';
import { CurrentWeatherResponse, OpenWeatherMapService } from '../src/open-weather/open-weather.service';
import { WeatherModule } from '../src/weather/weather.module';

describe('WeatherController', () => {
  const mockCurrentWeatherResponse: CurrentWeatherResponse = {
    coord: {
      lon: -70.7579,
      lat: 42.7504
    },
    weather: [
      {
        id: 804,
        main: "Clouds",
        description: "overcast clouds",
        icon: "04d"
      }
    ],
    base: "stations",
    main: {
      temp: 48.88,
      feels_like: 44.74,
      temp_min: 47.17,
      temp_max: 50.27,
      pressure: 1001,
      humidity: 97,
      sea_level: 1001,
      grnd_level: 1000
    },
    visibility: 4097,
    wind: {
      speed: 9.75,
      deg: 332,
      gust: 10.83
    },
    clouds: {
      all: 100
    },
    dt: 1728929811,
    sys: {
      type: 2,
      id: 2096887,
      country: "US",
      sunrise: 1728903326,
      sunset: 1728943324
    },
    timezone: -14400,
    id: 4940625,
    name: "Ipswich",
    cod: 200
  };
  let app: INestApplication;
  let openWeatherService: OpenWeatherMapService;
  let getCurrentWeatherMock: jest.SpyInstance;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule, OpenWeatherMapModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    openWeatherService = app.get<OpenWeatherMapService>(OpenWeatherMapService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    getCurrentWeatherMock = jest.spyOn(openWeatherService, 'getCurrentWeatherFromLatitudeLongitude').mockImplementation(() => Promise.resolve(mockCurrentWeatherResponse));
  });

  afterEach(async () => {
    getCurrentWeatherMock.mockRestore();
  });

  it('current weather request that gets weather from lat/lon returns 200', () => {
    return request(app.getHttpServer())
      .get('/weather/current')
      .query({ latitude: 1, longitude: 1 })
      .expect(200);
  });

  it('current weather request that gets weather from zip returns 200', () => {
    jest.spyOn(openWeatherService, 'getLocationFromZipCode').mockImplementation(() => Promise.resolve({ latitude: '1', longitude: '1' }));

    return request(app.getHttpServer())
      .get('/weather/current')
      .query({ zipCode: '02127' })
      .expect(200);
  });

  it('current weather request that gets weather from city/state returns 200', () => {
    jest.spyOn(openWeatherService, 'getLocationFromCityStateName').mockImplementation(() => Promise.resolve({ latitude: '1', longitude: '1' }));

    return request(app.getHttpServer())
      .get('/weather/current')
      .query({ cityState: 'Boston, MA' })
      .expect(200);
  });
});
