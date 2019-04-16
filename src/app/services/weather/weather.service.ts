import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import {
  IWeatherResponse,
  IWeatherQuery,
  IWeatherQueryById,
  TempQueryUnits,
  tempUnits
} from 'models/weather';
import { Observable, BehaviorSubject } from 'rxjs';
import { retry, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private currentUnit$ = new BehaviorSubject<tempUnits>('Celsius');
  unit$ = this.currentUnit$.pipe(distinctUntilChanged());

  forecast$ = new BehaviorSubject<IWeatherResponse>(null);

  constructor(private http: HttpClient) {}

  forecastById(id: string) {
    const query: IWeatherQueryById = {
      id,
      mode: 'json',
      units: TempQueryUnits.Celsius
    };

    this.request(query).subscribe(data => this.forecast$.next(data));
  }

  request<T extends IWeatherQuery>(query: T): Observable<IWeatherResponse> {
    return this.http
      .get<IWeatherResponse>(environment.openweather.url, {
        params: { APPID: environment.openweather.apiKey, ...query }
      })
      .pipe(retry(3));
  }

  changeUnit(unit: tempUnits) {
    this.currentUnit$.next(unit);
  }
}
