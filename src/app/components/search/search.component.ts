import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';

@Component({
  selector: 'wt-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  inputValue$ = new BehaviorSubject<string>('');
  text$ = new BehaviorSubject<string>('');

  value$ = merge(this.inputValue$, this.text$);

  @Input() set value(value: string) {
    this.inputValue$.next(value);
  }

  @Output() changeTerm = new EventEmitter<string>();

  @ViewChild('input', { read: ElementRef })
  input: ElementRef<HTMLInputElement>;

  handleInput(term: string) {
    this.changeTerm.emit(term);
  }

  cleanField() {
    this.text$.next('');
    // Angular may not detect this as a changed value so force the rounded
    // value back to the input.
    this.input.nativeElement.value = String('');
    this.changeTerm.emit('');
  }

  fillField() {
    const oldValue = this.inputValue$.getValue();
    this.text$.next(this.inputValue$.getValue());
    // Angular may not detect this as a changed value so force the rounded
    // value back to the input.
    this.input.nativeElement.value = String(oldValue);
    this.changeTerm.emit('');
  }
}
