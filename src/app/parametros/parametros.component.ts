import { Component, OnInit } from '@angular/core';

import { NgForm, FormBuilder } from '@angular/forms';

import { IbexService } from '../shared/ibex/ibex.service';

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Ibex } from '../shared/ibex/ibex.model';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  constructor(
    public ibexService: IbexService, 
    public apiSolverService : ApisolverService,
    ){}

  instanciaFlag: Boolean;
  graficadoFlag: Boolean;
  constantFlag: Boolean;
  comandList: string[];

  modalSection: Number
  inputModal: string


  errorMessageFlag: Boolean;
  errorMessage: string;

  ngOnInit() {

    this.apiSolverService.currentInstanciaFlag.subscribe(instanciaFlag => this.instanciaFlag = instanciaFlag)
    this.apiSolverService.currentGraficoFlag.subscribe(graficoFlag => this.graficadoFlag = graficoFlag)
    this.apiSolverService.currentComandList.subscribe(comandList => this.comandList = comandList)

    this.initializeParams()
  }
  
  async initializeParams(){
    this.inputModal = ""
    this.modalSection = 0;
    this.errorMessage = "";
    this.comandList = []
    this.errorMessageFlag = false;
    this.constantFlag = false;
    this.ibexService.selectedDomain = {
      index: 0,
      var: "",
      infValue: 0,
      supValue: 0
    }
    this.ibexService.selectedConstraint = {
      index: 0,
      value: ""
    } 
    this.ibexService.selectedConstant = {
      index: 0,
      name: "",
      infValue: 0,
      supValue: 0
    }

    if ( this.ibexService.functions.length == 0){
      this.ibexService.selectedFunction = {
        index: 0,
        value: '-(25*(x1-2)^2+(x2-2)^2+(x3-1)^2+(x4-4)^2+(x5-1)^2) = z1;'
      }
      await this.plusFunction()
      
      this.ibexService.selectedFunction = {
        index: 0,
        value: 'x1^2+x2^2+x3^2+x4^2+x5^2+x6^2 = z2;'
      } 
      await this.plusFunction()
      this.ibexService.constraints.push('-(x1+x2-2) <= 0;')
      this.ibexService.constraints.push('-(-x1-x2+6) <= 0;')
      this.ibexService.constraints.push('-(x1-x2+2) <= 0;\n')
      this.ibexService.constraints.push('-(-x1+3*x2+2) <= 0;\n' )
      this.ibexService.constraints.push('-(-(x3-3)^2-x4+4) <= 0;\n')
      this.ibexService.constraints.push('-((x5-3)^2+x6-4) <= 0;')
    }
  }

  deleteDom(dom){
    let index = this.ibexService.domains.indexOf(dom)
    this.ibexService.domains.splice(index, 1);
  }

  deleteFun(fun){
    let index = this.ibexService.functions.indexOf(fun)
    this.ibexService.functions.splice(index, 1);
  }

  deleteCnt(cnt){
    let index = this.ibexService.constraints.indexOf(cnt)
    this.ibexService.constraints.splice(index, 1);
  }

  deleteConstant(cnst){
    let index = this.ibexService.constants.indexOf(cnst)
    this.ibexService.constants.splice(index, 1)
  }

  async plusFunction(){
    if( await this.validateFunction() == true){
      this.ibexService.functions.push(this.ibexService.selectedFunction.value)
      this.ibexService.selectedFunction = {
        index: 0,
        value: ""
      };
    }else{
      this.errorMessage = "Corrobore la sintaxis de su función"
      this.errorMessageFlag = true;
    }
  }

  plusDomain(){
    this.ibexService.domains.push(
      this.ibexService.selectedDomain.var +
      " in [ " +
      this.ibexService.selectedDomain.infValue.toString() +
      "," +
      this.ibexService.selectedDomain.supValue.toString() +
      "];\n"
    )
    this.ibexService.domainVariablesNames.push(this.ibexService.selectedDomain.var)
    this.ibexService.selectedDomain = {
      index: 0,
      var: "",
      infValue: 0,
      supValue: 0
    }                                                                                                                                                                                                                                                                                                                                                                                                                  
  }

  plusConstraint(){
    this.ibexService.constraints.push(this.ibexService.selectedConstraint.value)
    this.ibexService.selectedConstraint = {
      index: 0,
      value: ""
    };
  }

  plusConstant(){
    this.ibexService.constants.push(
      "const " +
      this.ibexService.selectedConstant.name +
      " [ " +
      this.ibexService.selectedConstant.infValue.toString() + 
      "," +
      this.ibexService.selectedConstant.supValue.toString() + 
      " ] ;\n"
    )
    this.ibexService.constantVariableNames.push(this.ibexService.selectedConstant.name)
    this.ibexService.selectedConstant = {
      index: 0,
      name: "",
      infValue: 0,
      supValue: 0
    }
  }

  async validateFunction(){
    let operadores = ['/','-','+','*','^']
    let parIn = 0;
    let parOut = 0;
    let fncSnEspacios = ""
    for (let index = 0; index < this.ibexService.selectedFunction.value.length; index++) {
      const element = this.ibexService.selectedFunction.value[index];
      if(element != ' '){
        fncSnEspacios += element
      }
      if( element == '('){
        parIn = parIn + 1
      }else if( element == ')'){
        parOut = parOut + 1;
      }
    }
    if( parIn != parOut){
      return false;
    }
    if( await this.identificarOperaciones(fncSnEspacios, operadores) == false){
      return false;
    }else if (await this.identificarVariables(fncSnEspacios) == false){
      return false;
    }
    this.errorMessageFlag = false;
    this.errorMessage = "";
    return true
  }

  async identificarVariables(fnc){
    console.log('fnc: ', fnc)
    let operadores = ['/','-','+','*','^','(',')','=',';']
    let numeros = ['0','1','2','3','4','5','6','7','8','9']
    let actual = ""
    let functionVariablesNamesCopy = Object.assign([], this.ibexService.functionVariablesNames);
    for (let index = 0; index < fnc.length; index++) {
      if (operadores.indexOf(fnc[index]) == -1){
        actual += fnc[index]
        if( index == fnc.length-1){
          if( numeros.indexOf(actual[0]) == -1){
            if(functionVariablesNamesCopy.indexOf(actual) == -1){
              functionVariablesNamesCopy.push(actual)
              actual = ""
            }
          }
        }
      }else if( index == 0){
        continue
      }else{  
        for (let j = 0; j < actual.length; j++) {
          //Si la primera posicion es un número
          if(numeros.indexOf(actual[0]) != -1){
            // lo desecha si parte con numero y tiene una letra posteriormente
            if(numeros.indexOf(actual[j]) == -1){
              actual = ""
              break
            }
          }
          //Si esta revisando el ultimo caracter
          if( j == actual.length-1){
              //Si es un numero
              if(numeros.indexOf(actual[0].toString()) != -1){
                actual = ""
                break
              }

              if(functionVariablesNamesCopy.indexOf(actual) == -1){
                functionVariablesNamesCopy.push(actual)
                actual = ""
              }else{
                actual = ""
              }
          }

        }
      }
    }
    await this.createNonExistentDomains(functionVariablesNamesCopy)
    this.ibexService.functionVariablesNames = functionVariablesNamesCopy;
    return true;
  }

  async createNonExistentDomains(nombres){
    for (let i = 0; i < nombres.length; i++) {
      const element = nombres[i];
      if(this.ibexService.domainVariablesNames.indexOf(element) == -1 && this.ibexService.constantVariableNames.indexOf(element) == -1){
        if(element == "z1" || element == "z2"){
          continue
        }
        this.ibexService.domainVariablesNames.push(element)  
        this.ibexService.domains.push(
          element +
          " in [ 0,10]; "   
        )
      }
      
    }
  }

  async identificarOperaciones(fnc, operadores){
    if( fnc[0].toString() != '+' && fnc[0].toString() != '-'){
      for (let index = 0; index < fnc.length; index++) {
        const ele = fnc[index];
        if( operadores.indexOf(fnc[fnc.length-1].toString()) != -1){
          return false
        }
        if( operadores.indexOf(ele) != -1){
          if (index == fnc.length){
            return false
          }else{
            if( operadores.indexOf(fnc[index-1]) != -1 || operadores.indexOf(fnc[index+1]) != -1 ||
                fnc[index-1] == '(' || fnc[index+1] == ')' ){
                  return false
                }
          }
        }
      }
    }
    return true
  }

  async concatenateParameters(){

    let concatenation = ""
    let domainsCopy = Object.assign([], this.ibexService.domains);
    domainsCopy.push('z1 in [-1e8, 1e8];\n')
    domainsCopy.push('z2 in [-1e8, 1e8];\n')

    concatenation += 'variables\n' 

    for (const k in domainsCopy) {
      concatenation += domainsCopy[k]
    }

    concatenation += '\n'
    concatenation += 'constraints\n'
    
    for (const i in this.ibexService.functions) {
      concatenation += this.ibexService.functions[i]
    }

    for (const j in this.ibexService.constraints) {
      concatenation += this.ibexService.constraints[j]
    }

    

    for (const w in this.ibexService.constants) {
      concatenation +=  this.ibexService.constants[w]
    }

    concatenation += '\nend'
    
    return concatenation
  }
  
  async crearInstancia(){
    if ( await this.comprobarVariables() == true){
      this.instanciaFlag = true;
      this.apiSolverService.changeInstanciaFlag(this.instanciaFlag)
  
      let filename = Math.floor((Math.random() * 1000000) + 1);
  
      let base = 'http://localhost:3000/tesis/';
      let concatenateParameters = this.concatenateParameters()
  
      this.apiSolverService.setInstance(filename.toString(), base, await concatenateParameters).subscribe((res) => {
        console.log("res: crearInstancia", res)
        this.comandList.push('CrearInstancia')
        this.apiSolverService.changeCommandList(this.comandList)
      })
      this.instanciaFlag = true;
    }
  }

  //Compruebo que las variables que están en las funciones también están en las variables de los dominios
  async comprobarVariables(){
    let domainsCopy = Object.assign([], this.ibexService.domainVariablesNames);
    domainsCopy.push('z1')
    domainsCopy.push('z2')
    for (let i = 0; i < this.ibexService.functionVariablesNames.length; i++) {
      const element = this.ibexService.functionVariablesNames[i];
      if( domainsCopy.indexOf(element.toString()) == -1 && this.ibexService.constantVariableNames.indexOf(element.toString()) == -1){
        this.errorMessage = "Las variables que están en la función son distintas a los de los dominios"
        this.errorMessageFlag = true;
        return false
      }
    }
    return true
  }

  //Asigno index a su correspondiente seleccion de datos (constante, dominio, funcion o restriccion)
  //Además, se asigna valor a la variable modalSection, la cual controla los input a mostrar en la ventana modal
  editarParametro(index, grupo){
    this.modalSection = grupo
    if( grupo == 0){
      this.ibexService.selectedFunction.index = index;
    }else if( grupo == 1){
      this.ibexService.selectedDomain.index = index;
    }else if( grupo == 2){
      console.log('index: ', index)
      this.ibexService.selectedConstraint.index = index;
    }else if( grupo == 3){
      this.ibexService.selectedConstant.index = index;
    }
  }
  editConstant(){
    let index = this.ibexService.selectedConstant.index
    this.ibexService.constants[index] = (
      "const " +
      this.ibexService.selectedConstant.name +
      " [ " +
      this.ibexService.selectedConstant.infValue.toString() + 
      "," +
      this.ibexService.selectedConstant.supValue.toString() + 
      " ] ;\n"
    )
    this.ibexService.selectedConstant = {
      index: 0,
      name: "",
      infValue: 0,
      supValue: 0
    }
  }

  editConstraint(){
    let index = this.ibexService.selectedConstraint.index
    this.ibexService.constraints[index] = (
      this.ibexService.selectedConstraint.value
    )
    this.ibexService.selectedConstraint = {
      index: 0,
      value: ""
    }
  }

  editDomain(){
    let index = this.ibexService.selectedDomain.index
    this.ibexService.domains[index] = (
      this.ibexService.selectedDomain.var +
      " in [ " +
      this.ibexService.selectedDomain.infValue.toString() +
      "," +
      this.ibexService.selectedDomain.supValue.toString() +
      "];\n"
    )
    this.ibexService.selectedDomain = {
      index: 0,
      var: "",
      infValue: 0,
      supValue: 0
    }  
  }

  editFunction(){
    let index = this.ibexService.selectedFunction.index
    this.ibexService.functions[index] = this.ibexService.selectedFunction.value
    this.ibexService.selectedFunction = {
      index: 0,
      value: " "
    }
  }
}
