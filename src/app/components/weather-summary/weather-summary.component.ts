import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { tempUnits } from 'models/weather';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'wt-weather-summary',
  templateUrl: './weather-summary.component.html',
  styleUrls: ['./weather-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherSummaryComponent {
  @Input() unit: tempUnits;
  @Input() date: string;
  @Input() temperature: number;
  @Input() icon: string;
  @Input() altIcon: string;
  @Input() description: string;
  @Input() windSpeed: number;
  @Input() windDirection: number;

  get tempUnit() {
    return this.unit === 'Celsius' ? '˚C' : '˚F';
  }

  get source() {
    const { icon } = this;
    return icon ? `http://openweathermap.org/img/w/${icon}.png` : null;
  }

  get transform() {
    const { sanitizer, windDirection } = this;
    return windDirection
      ? sanitizer.bypassSecurityTrustStyle(
          `transform: rotate(${windDirection}deg);`
        )
      : null;
  }

  constructor(private sanitizer: DomSanitizer) {}
}
