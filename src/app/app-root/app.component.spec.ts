import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ComponentsModule } from 'components/components.module';
import { WeatherService } from 'services/weather/weather.service';
import { BehaviorSubject } from 'rxjs';
import { tempUnits } from 'models/weather';
import { skip } from 'rxjs/operators';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let service: WeatherService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ComponentsModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: WeatherService,
          useValue: { 
            unit$: new BehaviorSubject<tempUnits>('Celsius'),
            changeUnit(value: tempUnits) {
              this.unit$.next(value)
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = TestBed.get(WeatherService);
  }));

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should consume unit from service`, done => {
    component.unit$.subscribe(unit => {
      expect(unit).toBe('Celsius');
      done();
    });
  });

  it('should update the unit value', done => {
    component.unit$.pipe(skip(1)).subscribe(unit => {
      expect(unit).toBe('Fahrenheit');
      done();
    });
    component.handleUnitChange('Fahrenheit');
  });
});
