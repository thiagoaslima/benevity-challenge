import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CitiesService } from 'services/cities/cities.service';

@Component({
  selector: 'wt-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyComponent implements OnInit {
  constructor(private citiesService: CitiesService) {}

  ngOnInit() {
    this.citiesService.select(null);
  }
}
