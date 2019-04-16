import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyComponent } from './empty.component';
import { CitiesService } from 'services/cities/cities.service';

@Component({
  selector: 'wt-city-selector',
  template: ''
})
class WtCitySelectorMockComponent {}

describe('EmptyComponent', () => {
  let component: EmptyComponent;
  let fixture: ComponentFixture<EmptyComponent>;
  let service: { select: jasmine.Spy };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyComponent, WtCitySelectorMockComponent],
      providers: [
        {
          provide: CitiesService,
          useValue: jasmine.createSpyObj('service', ['select'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyComponent);
    component = fixture.componentInstance;
    service = TestBed.get(CitiesService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a null city on init', () => {
    fixture.detectChanges();
    expect(service.select).toHaveBeenCalledTimes(1);
    expect(service.select).toHaveBeenCalledWith(null);
  });
});
