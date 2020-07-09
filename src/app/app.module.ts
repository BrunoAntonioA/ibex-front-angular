import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {NgApexchartsModule} from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PointsComponent } from './points/points.component';
import { GraphComponent } from './graph/graph.component';
import { IbexComponent } from './ibex/ibex.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { AmbosComponent } from './ambos/ambos.component';
import { InicioComponent } from './inicio/inicio.component';
import { PlotlyComponent } from './plotly/plotly.component';

const appRoutes: Routes = [
  { path: 'ibex', 
    component: IbexComponent,
    children: [
        { path: 'parametros', component: ParametrosComponent},
        { path: 'grafico', component: GraphComponent},
        { path: 'ambos', component: AmbosComponent}
    ]
  },
  { path: '', component: InicioComponent }
  
];


@NgModule({
  declarations: [
    AppComponent,
    PointsComponent,
    GraphComponent,
    IbexComponent,
    ParametrosComponent,
    AmbosComponent,
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
    )
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export const routingComponents = [
  IbexComponent, PointsComponent
]
