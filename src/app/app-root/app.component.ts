import { Component } from '@angular/core';
import { tempUnits } from 'models/weather';
import { WeatherService } from 'services/weather/weather.service';

@Component({
  selector: 'wt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  unit$ = this.weatherService.unit$;

  constructor(private weatherService: WeatherService) {}

  handleUnitChange(unit: tempUnits) {
    this.weatherService.changeUnit(unit);
  }
}
