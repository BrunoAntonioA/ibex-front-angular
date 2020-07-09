import { Component } from '@angular/core';

import { IbexService } from './shared/ibex/ibex.service';
import { SessionService } from './shared/session/session.service';

import { Ibex } from './shared/ibex/ibex.model';
import { Session } from './shared/session/session.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ICI - solver';

  constructor(private ibexService: IbexService, private sessionService: SessionService){}

  ngOnInit(){
    this.initializeSession();

  }

  initializeSession(){
    sessionStorage.clear()
    var ibex = new Ibex();
    ibex.filename = "";

    /*
    this.ibexService.postIbex(ibex).subscribe((res: any) =>{
      var session = new Session();
      session.ibexId = res._id;
      sessionStorage.setItem("ibexId", res._id)

      this.sessionService.postSession(session).subscribe((res: any) => {
        sessionStorage.setItem("sessionId", res._id)

      });
    });
    */
  }
  
}
