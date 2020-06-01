import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { IbexService } from '../shared/ibex/ibex.service';

import { Ibex } from '../shared/ibex/ibex.model';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  constructor(public ibexService: IbexService) { }

  async ngOnInit() {
    this.initializeParams()
  }
  
  async initializeParams(){
    this.ibexService.selectedDomain = ""
    this.ibexService.selectedDomain = ""
    this.ibexService.selectedFunction = ""
    this.ibexService.selectedIbex = new Ibex()
    this.ibexService.getIbexId(sessionStorage.getItem("ibexId")).subscribe((res : Ibex) => {
      this.ibexService.selectedIbex = res;
    });
  }

  
  async plusFunction(){
    //this.ibexService.selectedIbex.fnctions.push(this.ibexService.selectedFunction)
    this.ibexService.putIbex(this.ibexService.selectedIbex).subscribe((res) => {
      this.ibexService.selectedFunction = ""
      
    });
  }

  async plusDomain(){
    //this.ibexService.selectedIbex.domains.push(this.ibexService.selectedDomain)
    this.ibexService.putIbex(this.ibexService.selectedIbex).subscribe((res) => {
      this.ibexService.selectedDomain = ""

    });
  }
  async plusConstraint(){
    //this.ibexService.selectedIbex.constraints.push(this.ibexService.selectedConstraint)
    this.ibexService.putIbex(this.ibexService.selectedIbex).subscribe((res) => {
      this.ibexService.selectedConstraint = ""
      
    });
  }
  

}
