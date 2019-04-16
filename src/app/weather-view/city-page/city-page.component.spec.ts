import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CityPageComponent } from './city-page.component';
import { tempUnits, IWeatherResponse } from 'models/weather';
import { BehaviorSubject, Subject } from 'rxjs';
import { WeatherViewService } from '../weather-view-service/weather-view-service.service';
import { ActivatedRoute } from '@angular/router';
import { weatherResponse } from 'services/weather/weather.mock';

@Component({
  selector: 'wt-city-selector',
  template: ''
})
class WtCitySelectorMockComponent {}

@Component({
  selector: 'wt-navigation',
  template: ''
})
class WtNavigationMockComponent {
  @Input() unit: any;
  @Input() selected: any;
  @Input() dates: any;
  @Input() temperatures: any;
}

@Component({
  selector: 'wt-weather-graph',
  template: ''
})
class WtWeatherGraphMockComponent {
  @Input() series: any;
  @Input() dates: any;
}

@Component({
  selector: 'wt-weather-list',
  template: ''
})
class WtWeatherListMockComponent {
  @Input() humidity: number | undefined | null;
  @Input() clouds: number | undefined | null;
  @Input() rain: number | undefined | null;
  @Input() snow: number | undefined | null;
  @Input() pressure: number | undefined | null;
}

@Component({
  selector: 'wt-weather-summary',
  template: ''
})
class WtWeatherSummaryMockComponent {
  @Input() unit: tempUnits;
  @Input() date: string;
  @Input() temperature: number;
  @Input() icon: string;
  @Input() altIcon: string;
  @Input() description: string;
  @Input() windSpeed: number;
  @Input() windDirection: number;
}

const service = {
  unit$: new BehaviorSubject<tempUnits>('Celsius'),
  graph$: new BehaviorSubject<{
    dates: string[];
    series: number[];
  }>({ dates: [], series: [] }),
  dates$: new BehaviorSubject<{
    dates: string[];
    temperatures: {
      max: number;
      min: number;
    }[];
  }>({ dates: [], temperatures: [] }),
  dayData$: new BehaviorSubject({}),
  selectedDate$: new BehaviorSubject<string>(''),
  forecast$: new BehaviorSubject<IWeatherResponse>(null),
  forecastById: jasmine.createSpy('forecastById'),
  selectDay: jasmine.createSpy('selectDay'),
  selectHour: jasmine.createSpy('selectHour')
};

const route = {
  params: new Subject<{ cityId: string }>()
};

describe('CityPageComponent', () => {
  let component: CityPageComponent;
  let fixture: ComponentFixture<CityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CityPageComponent,
        WtNavigationMockComponent,
        WtCitySelectorMockComponent,
        WtWeatherGraphMockComponent,
        WtWeatherSummaryMockComponent,
        WtWeatherListMockComponent
      ],
      providers: [
        { provide: WeatherViewService, useValue: service },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CityPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('get forecast', () => {
    it('should call forecastById on route change, ignoring same value', () => {
      fixture.autoDetectChanges();
      route.params.next({ cityId: '1' });
      route.params.next({ cityId: '1' });
      route.params.next({ cityId: '1' });
      route.params.next({ cityId: '2' });
      route.params.next({ cityId: '2' });
      route.params.next({ cityId: '1' });
      expect(service.forecastById).toHaveBeenCalledTimes(3);
      expect(service.forecastById.calls.allArgs()).toEqual([
        ['1'],
        ['2'],
        ['1']
      ]);
    });
  });

  it('should select the date', () => {
    component.handleSelectDay({ date: '', hour: '' });
    expect(service.selectDay).toHaveBeenCalledTimes(1);
  });

  it('should select the hour', () => {
    component.handleSelectHour('');
    expect(service.selectHour).toHaveBeenCalledTimes(1);
  });
});
