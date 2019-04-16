import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { tempUnits } from 'models/weather';

@Component({
  selector: 'wt-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  @Input() dates: {date: string, hour: string}[] = [];
  @Input() temperatures: {max: string, min: string}[] = [];
  @Input() unit: tempUnits = 'Celsius';
  @Input() selected: {date: string, hour: string} = {date: '', hour: ''};

  @Output() selectDate = new EventEmitter<{date: string, hour: string}>();

  get suffix() {
    return this.unit === 'Celsius' ? '°C' : '°F';
  }

  select(item: {date: string, hour: string}) {
    this.selectDate.emit(item);
  }
}
