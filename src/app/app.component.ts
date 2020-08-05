import { Component } from '@angular/core';
import { IbexService } from './shared/ibex/ibex.service';
import { SessionService } from './shared/session/session.service';
import { ApisolverService } from './shared/apisolver/apisolver.service';

import { Ibex } from './shared/ibex/ibex.model';
import { Session } from './shared/session/session.model';


declare const myTest: any;
declare const readCsv: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'ICI - solver';

  constructor(private ibexService: IbexService, private sessionService: SessionService, private apiSolverService: ApisolverService){}


  ngOnInit(){
    this.initializeSession();

  }

  initializeSession(){
    sessionStorage.clear()
    this.apiSolverService.getPort().subscribe((res: any) => {
      sessionStorage.setItem('port', res.port)
    }) 
    var ibex = new Ibex();
    ibex.filename = "";
    console.log(localStorage.getItem('port'));
  }
  
}
