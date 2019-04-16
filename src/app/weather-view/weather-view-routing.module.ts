import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './empty/empty.component';
import { CityPageComponent } from './city-page/city-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: EmptyComponent },
  {
    path: 'cities/:cityId',
    component: CityPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeatherViewRoutingModule {}
