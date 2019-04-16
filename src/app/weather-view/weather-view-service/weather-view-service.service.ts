import { Injectable } from '@angular/core';

import { WeatherService } from 'services/weather/weather.service';
import { IWeatherResponse, tempUnits } from 'models/weather';
import { CitiesService } from 'services/cities/cities.service';

import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherViewService {
  private NUMBER_DAYS = 5;
  private NUMBER_HOURS = 8;

  selectedDate$ = new BehaviorSubject<{ date: string; hour: string }>({
    date: '',
    hour: ''
  });
  unit$ = this.weatherService.unit$;
  forecast$ = combineLatest(this.weatherService.forecast$, this.unit$).pipe(
    map(([forecast, unit]) => this.convertTemperatures(forecast, unit))
  );

  dates$: Observable<{
    dates: { date: string; hour: string }[];
    temperatures: { max: string; min: string }[];
  }> = this.forecast$.pipe(
    filter(data => Boolean(data) && Boolean(data.list) && data.list.length > 0),
    map(({ list }) => {
      const dates = list.reduce((acc, item) => {
        const [date, hour] = item.dt_txt.split(' ');
        if (!acc[date]) {
          acc[date] = {
            date,
            hour
          };
        }
        return acc;
      }, {});

      const dateSet = Object.keys(dates)
        .map(key => dates[key])
        .slice(0, this.NUMBER_DAYS);

      const temps = dateSet.map(({ date }) => {
        const temperatures = list
          .filter(item => item.dt_txt.includes(date))
          .map(item => Number(item.main.temp));

        return {
          max: String(Math.max(...temperatures)),
          min: String(Math.min(...temperatures))
        };
      });

      return {
        dates: dateSet,
        temperatures: temps
      };
    })
  );

  viewSubset$ = combineLatest(
    this.selectedDate$.pipe(map(({ date }) => date)),
    this.forecast$
  ).pipe(
    filter(
      ([date, forecast]) => Boolean(date) && this.hasWeatherItems(forecast)
    ),
    map(([date, { list }]) => {
      const idx = list.findIndex(item => item.dt_txt.includes(date));
      return list.slice(idx, idx + this.NUMBER_HOURS);
    })
  );

  dayData$: Observable<{
    date: string;
    temperature: string;
    icon: string;
    altIcon: string;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDeg: number;
    clouds: number;
    rain: number;
    snow: number;
  }> = combineLatest(
    this.selectedDate$.pipe(map(({ hour }) => hour)),
    this.viewSubset$
  ).pipe(
    map(([hour, forecast]) => {
      const idx = forecast.findIndex(item => item.dt_txt.includes(hour));
      const dayData = forecast[idx];
      debugger;

      return {
        date: dayData.dt_txt,
        temperature: dayData.main.temp,
        icon: dayData.weather[0].icon,
        altIcon: dayData.weather[0].main,
        description: dayData.weather[0].description,
        humidity: dayData.main.humidity,
        pressure: dayData.main.pressure,
        windSpeed: dayData.wind ? dayData.wind.speed : null,
        windDeg: dayData.wind ? dayData.wind.deg : null,
        clouds:
          dayData.clouds && dayData.clouds.hasOwnProperty('all')
            ? dayData.clouds.all
            : null,
        rain:
          dayData.rain && dayData.rain.hasOwnProperty('3h')
            ? dayData.rain['3h']
            : null,
        snow:
          dayData.snow && dayData.snow.hasOwnProperty('3h')
            ? dayData.snow['3h']
            : null
      };
    })
  );

  graph$ = this.viewSubset$.pipe(
    filter(Boolean),
    map(data => {
      const dates = data.map(item => item.dt_txt);
      const series = data.map(item => item.main.temp);
      return { dates, series };
    })
  );

  constructor(
    private weatherService: WeatherService,
    private citiesService: CitiesService
  ) {
    // Updates selected date and hour for the first available in the weather forecast data
    this.forecast$
      .pipe(
        filter(this.hasWeatherItems),
        map(data => data.list[0].dt_txt)
      )
      .subscribe(fulldate => {
        const [date, hour] = fulldate.split(' ');
        this.selectDay({ date, hour });
      });

    // Updates selected city for the weather forecast data
    this.forecast$.subscribe(forecast => {
      this.citiesService.select(forecast ? forecast.city : null);
    });
  }

  forecastById(id: string) {
    this.weatherService.forecastById(id);
  }

  selectDay({ date, hour }: { date: string; hour: string }) {
    this.selectedDate$.next({ date, hour });
  }

  selectHour(hour: string) {
    const { date } = this.selectedDate$.getValue();
    this.selectedDate$.next({ date, hour });
  }

  private hasWeatherItems(forecast: IWeatherResponse): boolean {
    return (
      Boolean(forecast) && Boolean(forecast.list) && forecast.list.length > 0
    );
  }

  private convertTemperatures(
    forecast: IWeatherResponse,
    unit: tempUnits
  ): any {
    const list =
      forecast && forecast.list
        ? forecast.list.map(item => {
            return {
              ...item,
              main: {
                ...item.main,
                temp: this.convertTemperature(
                  item.main.temp,
                  unit === 'Celsius' ? null : this.convertCelsiusToFahrenheit
                ),
                temp_min: this.convertTemperature(
                  item.main.temp_min,
                  unit === 'Celsius' ? null : this.convertCelsiusToFahrenheit
                ),
                temp_max: this.convertTemperature(
                  item.main.temp_max,
                  unit === 'Celsius' ? null : this.convertCelsiusToFahrenheit
                )
              }
            };
          })
        : [];

    return {
      ...forecast,
      list
    };
  }

  private convertTemperature(
    temperature: number,
    fn: (value: number) => number
  ) {
    const value = fn ? fn(temperature) : temperature;
    return value.toFixed(0);
  }

  private convertCelsiusToFahrenheit(temp: number): number {
    const converted = (temp * 9) / 5 + 32;
    return Math.round(converted * 100) / 100;
  }
}
