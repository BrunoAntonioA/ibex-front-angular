import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { IbexService } from '../shared/ibex/ibex.service';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Ibex } from '../shared/ibex/ibex.model';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  constructor(public ibexService: IbexService, public apiSolverService : ApisolverService) { }

  instanciaFlag: Boolean;
  graficadoFlag: Boolean;

  ngOnInit() {

    this.apiSolverService.currentInstanciaFlag.subscribe(instanciaFlag => this.instanciaFlag = instanciaFlag)
    this.apiSolverService.currentGraficoFlag.subscribe(graficoFlag => this.graficadoFlag = graficoFlag)

    this.initializeParams()
  }
  
  async initializeParams(){

    this.ibexService.selectedDomain = ""
    this.ibexService.selectedDomain = ""
    this.ibexService.selectedFunction = ""
    this.ibexService.functions.push('-(25*(x1-2)^2+(x2-2)^2+(x3-1)^2+(x4-4)^2+(x5-1)^2) = z1;\n')
    this.ibexService.functions.push('x1^2+x2^2+x3^2+x4^2+x5^2+x6^2 = z2;\n')
    this.ibexService.constraints.push('-(x1+x2-2) <= 0;')
    this.ibexService.constraints.push('-(-x1-x2+6) <= 0;')
    this.ibexService.constraints.push('-(x1-x2+2) <= 0;\n')
    this.ibexService.constraints.push('-(-x1+3*x2+2) <= 0;\n' )
    this.ibexService.constraints.push('-(-(x3-3)^2-x4+4) <= 0;\n')
    this.ibexService.constraints.push('-((x5-3)^2+x6-4) <= 0;')
    this.ibexService.domains.push('x1 in [ 0,10];\n')
    this.ibexService.domains.push('x2 in [ 0,10];\n')
    this.ibexService.domains.push('x3 in [ 1,5];\n')
    this.ibexService.domains.push('x4 in [ 0,6];\n')
    this.ibexService.domains.push('x5 in [ 1,5];\n')
    this.ibexService.domains.push('x6 in [ 0,10];\n')
    this.ibexService.domains.push('z1 in [-1e8, 1e8];\n')
    this.ibexService.domains.push('z2 in [-1e8, 1e8];')
    
  }

  
  plusFunction(){
    this.ibexService.functions.push(this.ibexService.selectedFunction)
    this.ibexService.selectedFunction = "";
  }

  plusDomain(){
    this.ibexService.domains.push(this.ibexService.selectedDomain)
    this.ibexService.selectedDomain = "";

  }
  plusConstraint(){
    this.ibexService.constraints.push(this.ibexService.selectedConstraint)
    this.ibexService.selectedConstraint = "";
  }

  concatenateParameters(){
    let concatenation = ""

    concatenation += 'constants\n\n'
    concatenation += 'variables\n' 

    for (const k in this.ibexService.domains) {
      concatenation += this.ibexService.domains[k]
    }

    concatenation += '\n'
    concatenation += 'constraints\n'
    
    for (const i in this.ibexService.functions) {
      concatenation += this.ibexService.functions[i]
    }
    for (const j in this.ibexService.constraints) {
      concatenation += this.ibexService.constraints[j]
    }

    concatenation += '\nend'
    
    return concatenation
  }
  
  crearInstancia(){
    this.instanciaFlag = true;
    this.apiSolverService.changeInstanciaFlag(this.instanciaFlag)

    let filename = Math.floor((Math.random() * 1000000) + 1);

    let base = 'http://localhost:3000/tesis/';
    let concatenateParameters = this.concatenateParameters()

    this.apiSolverService.setInstance(filename.toString(), base, concatenateParameters).subscribe((res) => {
      console.log("res: crearInstancia", res)
    });
  }

}
