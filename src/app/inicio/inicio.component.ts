import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Instruccion } from '../shared/apisolver/instruccion.model';

declare const angular: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private apisolverService: ApisolverService) { }

  ngOnInit(): void {
  }

  tryApi(){
    var instruccion = new Instruccion();
    instruccion.instruc = "get";
    instruccion.param = "";
    instruccion.port = 8000;
    this.apisolverService.postInstruction(instruccion).subscribe((res) =>{
      console.log(res);
    });
  }

  tryIbex(){
    angular();
  }
}