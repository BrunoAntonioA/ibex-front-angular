import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {NgApexchartsModule} from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PointsComponent } from './points/points.component';
import { IbexComponent } from './ibex/ibex.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { InicioComponent } from './inicio/inicio.component';
import { PlotlyComponent } from './plotly/plotly.component';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';

import { PlotlyViaCDNModule } from 'angular-plotly.js';

PlotlyViaCDNModule.plotlyVersion = '1.49.4'; // can be `latest` or any version number (i.e.: '1.40.0')

const appRoutes: Routes = [
  { path: 'ibex', 
    component: IbexComponent,
    children: [
        { path: 'parametros', component: ParametrosComponent},
        { path: 'grafico', component: PlotlyComponent},
        { path: '', component: ParametrosComponent}
    ]
  },
  { path: '', component: InicioComponent }
  
];


@NgModule({
  declarations: [
    AppComponent,
    PointsComponent,
    IbexComponent,
    ParametrosComponent,
    PlotlyComponent,
    InicioComponent
  ],
  imports: [  
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true}// <-- debugging purposes only
    ),
    PlotlyViaCDNModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export const routingComponents = [
  IbexComponent, PointsComponent
]
