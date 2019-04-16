import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { CitiesService } from 'services/cities/cities.service';

import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  map
} from 'rxjs/operators';

@Component({
  selector: 'wt-city-selector',
  templateUrl: './city-selector.component.html',
  styleUrls: ['./city-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CitySelectorComponent implements OnInit, OnDestroy {
  private term$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  cities$ = this.citiesService.list$;
  value$ = this.citiesService.selected$.pipe(
    map(city => {
      return city ? [city.name, city.country].join(', ') : '';
    })
  );

  constructor(private citiesService: CitiesService) {}

  ngOnInit() {
    this.term$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => this.citiesService.search(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleChange(searchTerm: string) {
    this.term$.next(searchTerm);
  }
}
