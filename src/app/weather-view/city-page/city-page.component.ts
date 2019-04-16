import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WeatherViewService } from '../weather-view-service/weather-view-service.service';

@Component({
  selector: 'wt-city-page',
  templateUrl: './city-page.component.html',
  styleUrls: ['./city-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  unit$ = this.service.unit$;
  graph$ = this.service.graph$;
  dates$ = this.service.dates$;
  dayData$ = this.service.dayData$;
  selectedDate$ = this.service.selectedDate$;

  constructor(
    private route: ActivatedRoute,
    private service: WeatherViewService
  ) {}

  handleSelectDay(item: { date: string; hour: string }) {
    this.service.selectDay(item);
  }

  handleSelectHour(date: string) {
    this.service.selectHour(date);
  }

  ngOnInit() {
    this.route.params
      .pipe(
        pluck('cityId'),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((id: string) => this.service.forecastById(id));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
