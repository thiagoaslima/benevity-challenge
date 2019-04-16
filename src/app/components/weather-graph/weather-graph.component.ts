import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType } from 'ng-chartist';
import * as ctPointLabels from 'chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.js';

@Component({
  selector: 'wt-weather-graph',
  templateUrl: './weather-graph.component.html',
  styleUrls: ['./weather-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherGraphComponent {
  get data() {
    const { series, dates } = this;

    return {
      series: series
        ? [[series[0], ...series, series[series.length - 1]]]
        : [[]],
      labels: dates
        ? [null, ...dates.map(label => label.split(' ')[1].substr(0, 5)), null]
        : []
    };
  }
  constructor() {}
  type: ChartType = 'Line';

  @Input() series: number[] = [];
  @Input() dates: string[] = [];
  @Output() selectHour = new EventEmitter<string>();

  options: Chartist.ILineChartOptions = {
    axisX: {
      showGrid: false
    },
    axisY: {
      showLabel: false,
      showGrid: false
    },
    showArea: true,
    fullWidth: true,
    chartPadding: {
      top: 40,
      right: 0,
      bottom: 40,
      left: 0
    },
    lineSmooth: Chartist.Interpolation.cardinal({
      fillHoles: true
    }),
    plugins: [
      ctPointLabels({
        labelClass: 'ct-label',
        labelOffset: {
          x: 0,
          y: -10
        },
        textAnchor: 'middle'
      })
    ]
  };

  @HostListener('click', ['$event.target'])
  handleClick(target: HTMLElement) {
    if (!target.getAttribute('class').includes('ct-label')) {
      return;
    }

    if (target.tagName.toLowerCase() === 'span') {
      const date = this.dates.find(item => item.includes(target.innerText));
      this.selectHour.emit(date);
    }
  }

}
