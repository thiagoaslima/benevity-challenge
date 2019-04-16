import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { tempUnits } from 'models/weather';

@Component({
  selector: 'wt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() currentUnit: tempUnits = 'Celsius';
  @Output() unitChange = new EventEmitter<tempUnits>();

  handleUnitChange(unit: tempUnits) {
    if (this.currentUnit !== unit) {
      this.unitChange.emit(unit);
    }
  }
}
