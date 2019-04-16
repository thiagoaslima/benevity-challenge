import { fakeAsync, tick } from '@angular/core/testing';

import { WeatherViewService } from './weather-view-service.service';
import { IWeatherResponse, tempUnits } from 'src/app/models/weather';

import { Subject, BehaviorSubject } from 'rxjs';
import { ICity } from 'models/city';
import { weatherResponse } from 'services/weather/weather.mock';
import { skip } from 'rxjs/operators';

describe('WeatherPageService', () => {
  let pageService: WeatherViewService;
  let weatherServiceMock: {
    forecast$: Subject<IWeatherResponse>;
    unit$: Subject<tempUnits>;
    getForecast: jasmine.Spy;
    changeUnit: jasmine.Spy;
  };
  let citiesServiceMock: {
    selected$: Subject<ICity>;
    select: jasmine.Spy;
  };

  beforeEach(() => {
    weatherServiceMock = {
      forecast$: new BehaviorSubject<IWeatherResponse>(null),
      unit$: new BehaviorSubject<tempUnits>('Celsius'),
      getForecast: jasmine.createSpy('getForecast'),
      changeUnit: jasmine.createSpy('changeUnit')
    };

    citiesServiceMock = {
      selected$: new BehaviorSubject<ICity>(null),
      select: jasmine.createSpy('select')
    };

    pageService = new WeatherViewService(
      weatherServiceMock as any,
      citiesServiceMock as any
    );
  });

  it('should be created', () => {
    expect(pageService).toBeTruthy();
  });

  describe('unit', () => {
    it('should start with Celsius unit', done => {
      pageService.unit$.subscribe(unit => {
        expect(unit).toBe('Celsius');
        done();
      });
    });

    it('should update unit value', fakeAsync(() => {
      let value = null;
      pageService.unit$.subscribe(unit => {
        value = unit;
      });

      weatherServiceMock.unit$.next('Fahrenheit');
      tick(0);

      expect(value).toBe('Fahrenheit');
    }));
  });

  describe('selected day and hour', () => {
    it('should update the selected hour', done => {
      pageService.selectedDate$.pipe(skip(1)).subscribe(({hour}) => {
        expect(hour).toBe('09:00:00');
        done();
      });

      pageService.selectHour('09:00:00');
    });

    it('should update the selected day and hour', done => {
      pageService.selectedDate$.pipe(skip(1)).subscribe(date => {
        expect(date).toEqual({date: '2019-04-16', hour: '21:00:00'});
        done();
      });

      pageService.selectDay({ date: '2019-04-16', hour: '21:00:00' });
    });
  });

  it('should return the dates and min/max temperatures of each day', done => {
    pageService.dates$.subscribe(datesObj => {
      expect(datesObj).toEqual({
        dates: [
          { date: '2019-04-15', hour: '18:00:00' },
          { date: '2019-04-16', hour: '00:00:00' },
          { date: '2019-04-17', hour: '00:00:00' },
          { date: '2019-04-18', hour: '00:00:00' },
          { date: '2019-04-19', hour: '00:00:00' }
        ],
        temperatures: [
          { max: '10', min: '9' },
          { max: '10', min: '-6' },
          { max: '13', min: '-3' },
          { max: '18', min: '-1' },
          { max: '21', min: '6' }
        ]
      });
      done();
    });
    weatherServiceMock.forecast$.next(weatherResponse);
  });

  it('should receive the graph data', done => {
    pageService.graph$.subscribe(graph => {
      expect(graph).toEqual({
        dates: [
          '2019-04-15 18:00:00',
          '2019-04-15 21:00:00',
          '2019-04-16 00:00:00',
          '2019-04-16 03:00:00',
          '2019-04-16 06:00:00',
          '2019-04-16 09:00:00',
          '2019-04-16 12:00:00',
          '2019-04-16 15:00:00'
        ],
        series: ['9', '10', '8', '4', '-2', '-5', '-6', '2']
      });
      done();
    });
    weatherServiceMock.forecast$.next(weatherResponse);
  });

  describe('summary/dayData', () => {
    it('should receive daily info to summary component', done => {
      pageService.dayData$.subscribe(summary => {
        expect(summary).toEqual({
          date: '2019-04-15 18:00:00',
          temperature: '9',
          icon: '01d',
          altIcon: 'Clear',
          description: 'clear sky',
          humidity: 54,
          pressure: 1004.89,
          windSpeed: 1.32,
          windDeg: 48.0029,
          clouds: 0,
          rain: null,
          snow: null
        });
        done();
      });
      weatherServiceMock.forecast$.next(weatherResponse);
    });

    it('should update the daily info on day selection', done => {
      pageService.dayData$.pipe(skip(2)).subscribe(summary => {
        expect(summary).toEqual({
          date: '2019-04-17 09:00:00',
          temperature: '-2',
          icon: '02n',
          altIcon: 'Clouds',
          description: 'few clouds',
          humidity: 55,
          pressure: 1012.88,
          windSpeed: 1.76,
          windDeg: 221.002,
          clouds: 20,
          rain: null,
          snow: null
        });
        done();
      });
      weatherServiceMock.forecast$.next(weatherResponse);
      pageService.selectDay({ date: '2019-04-17', hour: '09:00:00' });
    });

    it('should update the daily info on hour selection', done => {
      pageService.dayData$.pipe(skip(1)).subscribe(summary => {
        expect(summary).toEqual({
          date: '2019-04-15 21:00:00',
          temperature: '10',
          icon: '10d',
          altIcon: 'Rain',
          description: 'light rain',
          humidity: 48,
          pressure: 1003.45,
          windSpeed: 1.76,
          windDeg: 220.001,
          clouds: 80,
          rain: 0.005,
          snow: null
        });
        done();
      });
      weatherServiceMock.forecast$.next(weatherResponse);
      pageService.selectHour('21:00:00');
    });
  });
});
