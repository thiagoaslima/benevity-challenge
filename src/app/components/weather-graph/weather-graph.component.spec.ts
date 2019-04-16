import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherGraphComponent } from './weather-graph.component';
import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'x-chartist',
  template: ''
})
class ChartistMockComponent {
  @Input() type: string;
  @Input() data: any;
  @Input() options: any;
}

describe('WeatherGraphComponent', () => {
  let component: WeatherGraphComponent;
  let fixture: ComponentFixture<WeatherGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherGraphComponent, ChartistMockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
