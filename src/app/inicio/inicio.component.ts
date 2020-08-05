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

  array : Array<Number>

  ngOnInit(): void {
    this.array = [1, 2, 3]
    console.log(this.array)
  }

  getIndex(n){
    console.log('indexOf(2): ', this.array.indexOf(n))
  }
}
