import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartistModule } from 'ng-chartist';

import { CitiesListComponent } from './cities-list/cities-list.component';
import { SearchComponent } from './search/search.component';
import { CitySelectorComponent } from './city-selector/city-selector.component';
import { WeatherSummaryComponent } from './weather-summary/weather-summary.component';
import { WeatherListComponent } from './weather-list/weather-list.component';
import { WeatherGraphComponent } from './weather-graph/weather-graph.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
    CitiesListComponent,
    SearchComponent,
    CitySelectorComponent,
    WeatherSummaryComponent,
    WeatherListComponent,
    WeatherGraphComponent,
    HeaderComponent,
    NavigationComponent
  ],
  exports: [
    CitiesListComponent,
    SearchComponent,
    CitySelectorComponent,
    WeatherSummaryComponent,
    WeatherListComponent,
    WeatherGraphComponent,
    HeaderComponent,
    NavigationComponent
  ],
  imports: [CommonModule, RouterModule, ChartistModule]
})
export class ComponentsModule {}
