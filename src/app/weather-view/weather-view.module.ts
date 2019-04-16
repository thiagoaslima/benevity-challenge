import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherViewRoutingModule } from './weather-view-routing.module';
import { EmptyComponent } from './empty/empty.component';
import { ComponentsModule } from 'components/components.module';
import { CityPageComponent } from './city-page/city-page.component';

@NgModule({
  declarations: [EmptyComponent, CityPageComponent],
  imports: [CommonModule, WeatherViewRoutingModule, ComponentsModule]
})
export class WeatherViewModule {}
