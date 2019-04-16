import { WeatherService } from './weather.service';
import { weatherResponse } from './weather.mock';
import { of } from 'rxjs';
import { skip } from 'rxjs/operators';

describe('WeatherService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let service: WeatherService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new WeatherService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('units stream', () => {
    it('should start with Celsius', done => {
      service.unit$.subscribe(unit => {
        expect(unit).toBe('Celsius');
        done();
      });
    });

    it('should change to Fahrenheit', done => {
      service.unit$.pipe(skip(1)).subscribe(unit => {
        expect(unit).toBe('Fahrenheit');
        done();
      });

      service.changeUnit('Fahrenheit');
    });
  });

  describe('forecast stream', () => {
    it('should start with a null value', done => {
      service.forecast$.subscribe(forecast => {
        expect(forecast).toBeNull();
        done();
      });
    });

    it('should update the forcast stream', done => {
      httpClientSpy.get.and.returnValue(of(weatherResponse));

      service.forecast$.pipe(skip(1)).subscribe(resp => {
        expect(resp).toEqual(weatherResponse);
        expect(httpClientSpy.get).toHaveBeenCalled();
        done();
      });

      service.forecastById('123');
    });
  });
});
