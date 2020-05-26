import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { IbexService } from '../shared/ibex/ibex.service';

import { Ibex } from '../shared/ibex/ibex.model';

@Component({
  selector: 'app-fnction',
  templateUrl: './fnction.component.html',
  styleUrls: ['./fnction.component.css']
})
export class FnctionComponent implements OnInit {

  constructor(private ibexService: IbexService) { }

  ngOnInit(): void {

    
    
  }

  refreshFunctions(){
    this.ibexService.getIbexId(sessionStorage.getItem("ibexId")).subscribe((res) => {
      
    });
  }
}
