import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {NgApexchartsModule} from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { PageComponent } from './page/page.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { PointsComponent } from './points/points.component';
import { GraphComponent } from './graph/graph.component';
import { FooterComponent } from './footer/footer.component';
import { FnctionComponent } from './fnction/fnction.component';
import { DomainComponent } from './domain/domain.component';
import { ConstraintComponent } from './constraint/constraint.component';
import { IbexComponent } from './ibex/ibex.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { AmbosComponent } from './ambos/ambos.component';
import { InicioComponent } from './inicio/inicio.component';

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
    TopMenuComponent,
    PageComponent,
    AsideMenuComponent,
    PointsComponent,
    GraphComponent,
    FooterComponent,
    FnctionComponent,
    DomainComponent,
    ConstraintComponent,
    IbexComponent,
    ParametrosComponent,
    AmbosComponent
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
  IbexComponent, PointsComponent, AsideMenuComponent
]
