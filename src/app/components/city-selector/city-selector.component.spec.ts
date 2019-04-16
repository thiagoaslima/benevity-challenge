import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ICity } from 'models/city';
import { CitySelectorComponent } from './city-selector.component';
import { CitiesService } from 'services/cities/cities.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'wt-search',
  template: ''
})
class WtSearchMockComponent {
  @Input() value: string;
}

@Component({
  selector: 'wt-cities-list',
  template: ''
})
class WtCitiesListMockComponent {
  @Input() list: ICity[];
}

const citiesMockService = {
  selected$: new Subject<ICity>(),
  list$: new Subject<ICity[]>(),
  search(term: string) {
    const arr = [
      {
        id: 1,
        name: 'Rio de Janeiro',
        country: 'BR'
      },
      {
        id: 2,
        name: 'Calgary',
        country: 'CA'
      }
    ].filter(city => city.name.includes(term));
    this.list$.next(arr);
  }
};

describe('CitySelectorComponent', () => {
  let component: CitySelectorComponent;
  let fixture: ComponentFixture<CitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CitySelectorComponent,
        WtSearchMockComponent,
        WtCitiesListMockComponent
      ],
      providers: [
        {
          provide: CitiesService,
          useValue: citiesMockService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should value$ be the selected city from service', done => {
    component.value$.subscribe(str => {
      expect(str).toBe('Calgary, CA');
      done();
    });
    citiesMockService.selected$.next({
      id: 2,
      name: 'Calgary',
      country: 'CA'
    });
  });

  it('should cities list be the service list value', done => {
    component.cities$.subscribe(arr => {
      expect(arr).toEqual([
        {
          id: 1,
          name: 'Rio de Janeiro',
          country: 'BR'
        },
        {
          id: 2,
          name: 'Calgary',
          country: 'CA'
        }
      ]);
      done();
    });
    citiesMockService.list$.next([
      {
        id: 1,
        name: 'Rio de Janeiro',
        country: 'BR'
      },
      {
        id: 2,
        name: 'Calgary',
        country: 'CA'
      }
    ]);
  });
});
