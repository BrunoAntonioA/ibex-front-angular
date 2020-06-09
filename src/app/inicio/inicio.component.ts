import { Component, OnInit } from '@angular/core';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Instruccion } from '../shared/apisolver/instruccion.model';

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
    this.apisolverService.postInstruction(instruccion).subscribe((res) =>{
      console.log(res);
    });
  }
}
