import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

const appRoutes: Routes = [
  { path: '', 
    component: IbexComponent,
    children: [
      { path: 'points', component: PointsComponent},
      { path: 'input', 
        component: AsideMenuComponent,
        children:[
          { path: '', component: FnctionComponent},
          { path: 'fnction', component: FnctionComponent},
          { path: 'domain', component: DomainComponent},
          { path: 'constraint', component: ConstraintComponent}
        ]
      },
      { path: '', 
        component: AsideMenuComponent,
        children:[
          { path: '', component: FnctionComponent},
          { path: 'fnction', component: FnctionComponent},
          { path: 'domain', component: DomainComponent},
          { path: 'constraint', component: ConstraintComponent}
        ]
      }
    ]
  }
  
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
    IbexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
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
