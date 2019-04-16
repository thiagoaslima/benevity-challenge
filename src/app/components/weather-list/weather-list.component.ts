import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'wt-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherListComponent {
  @Input() humidity: number | undefined | null;
  @Input() clouds: number | undefined | null;
  @Input() rain: number | undefined | null;
  @Input() snow: number | undefined | null;
  @Input() pressure: number | undefined | null;
}
