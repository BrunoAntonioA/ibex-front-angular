import { Component, OnInit, ViewChild, ElementRef, Output} from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { EventEmitter, HostListener, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

import { interval, timer, fromEvent } from 'rxjs';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

import { ApisolverService } from '../shared/apisolver/apisolver.service';

import { Instruccion } from '../shared/apisolver/instruccion.model';
import { Lines } from '../shared/lines.model';
import { Parameters } from '../shared/parameters.model';


@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css']
})
export class PlotlyComponent implements OnInit {
  // graphic data
  public debug = true;
  public useResizeHandler = true;
  public data: any[] = [];
  public layout: any = {};

  rpmFlag: Boolean;
  manualInteractionFlag: Boolean;
  interactionList: string[];
  parameters: Parameters;
  lines: Lines;
  precision: Number;
  graficadoFlag: Boolean;
  instanciaFlag: Boolean;
  gupFlag: Boolean;
  glwFlag: Boolean;
  comandList: string[];
  messageFlag: Boolean;
  message: string;

  constructor(private apisolverService: ApisolverService, private renderer: Renderer2) { }


  async ngOnInit() {
    this.apisolverService.currentLines.subscribe(lines => this.lines = lines)
    this.apisolverService.currentParameters.subscribe(parameters => this.parameters = parameters)
    this.apisolverService.currentGraficoFlag.subscribe(graficadoFlag => this.graficadoFlag = graficadoFlag)
    this.apisolverService.currentInstanciaFlag.subscribe(instanciaFlag => this.instanciaFlag = instanciaFlag)
    this.apisolverService.currentComandList.subscribe(comandList => this.comandList = comandList)

    this.initializeVariables();
    
  }

  async ejercutarInteraciones(){
    for (let i = 0; i < this.interactionList.length; i++) {
      const element = this.interactionList[i].slice(0, 3);
      if(element == 'run'){
        await this.ejecutarRun()
      }else if( element == 'gup'){
        await this.ejecutarGup()
      }else if (element == 'glw'){
        await this.ejecutarGlw()
      }
    }
    await this.updateGrafico()
    await this.updateGrafico()
  }

  changeInteraction(value){
    this.manualInteractionFlag = value
  }

  agregarRun(){
    this.interactionList.push('run 100 ' + this.precision.toString())
  }

  agregarGlw(){
    this.interactionList.push('glw 100 ' + this.precision.toString())
  }

  agregarGup(){
    this.interactionList.push('gup 100 ' + this.precision.toString())
  }

  
  pointClick(event: any){
    Swal.fire({
      title: 'RPM',
      text: '¿Quieres hacer una búsqueda en el punto X:' + event.points[0].x + ' Y:' + event.points[0].y + '?',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Si!',
      denyButtonText: 'No'
    }).then((res)=>{
      if( res.isConfirmed == true){
        this.rpmFlag = true
      }
    })
  }

  cancerlarRPM(){
    Swal.fire({
      title: 'RPM',
      text: '¿Deseas cancelar el RPM?',
      icon: 'error',
      showDenyButton: true,
      confirmButtonText: 'Si!',
      denyButtonText: 'No'
    }).then((res)=>{
      if( res.isConfirmed == true){
        this.rpmFlag = false
      }
    })
  }

  async verificarIgualdad(){
    let contador = 0;
    for (let i = 0; i < this.lines.upperX.length; i++) {
      let el = this.lines.upperX[i]
      let index = this.lines.lowerX.indexOf(el)
      if( index != -1){
        if(this.lines.upperY[i] == this.lines.lowerY[index]){
          contador = contador + 1
        }
      }
    }
    this.messageFlag = true;
    this.message = "La cantidad de datos iguales entre el lower bound y upper bound es de :" + contador.toString()
  }


  async zoomGraph(eventData){
    let count = 0;
    let x0, x1, y0, y1;
    for (const key in eventData) {
      if (Object.prototype.hasOwnProperty.call(eventData, key)) {
        const element = eventData[key];
        if( count == 0){
          x0 = element;
          count ++;
        }else if (count == 1){
          x1 = element;
          count ++;
        }else if (count == 2){
          y0 = element;
          count ++
        }else if (count == 3){
          y1 = element;
        }
      }
    }
    if(typeof(x0) != "boolean"){
      console.log('x1: ', x1)
      console.log('y1: ', y1)
      this.layout = {
        yaxis : {
          range : [y0, y1]
        },
        xaxis : {
          range: [x0, x1]
        }
      }
      this.precision = x1 / 100
      this.apisolverService.changePrecision(this.precision)
      this.ejecutarZoo(x1, y1)
    }else{
      this.precision = 1e-2
      this.apisolverService.changePrecision(this.precision)
    }  
  }

  zoomOut(){
    this.layout = {
    }
    this.precision = 1e-2
    this.apisolverService.changePrecision(this.precision)
  }
  
  //Instanciacion de variables e iniciado de graficado
  async ngAfterViewInit(){
    if( this.instanciaFlag == true){
      await  this.ejecutarRun()
      await this.ejecutarGlw()
      await this.ejecutarGup()
      this.glwFlag = false;
      const contador = interval(10000);
      contador.subscribe(() => {
        this.ejecutarRun();
      });
    }
  }

  async initializeVariables(){
    this.parameters = new Parameters()
    this.parameters.constraints = []
    this.parameters.domains = []
    this.parameters.fnctions = []
    this.interactionList = []
    this.manualInteractionFlag = true
    this.rpmFlag = false;
    
    if( this.instanciaFlag == true){
      this.data = [
        { x: this.lines.upperX, y: this.lines.upperY, type: 'scatter', mode: 'lines markers', name: 'Upper Bound', marker:{size:16} },
        { x: this.lines.lowerX, y: this.lines.lowerY, type: 'scatter', mode: 'lines', name: 'Lower Bound', marker:{size:16} },
      ]
      this.layout = {
        hovermode:'closest'
      }
    }
    this.precision = 1e-2
    this.apisolverService.changePrecision(this.precision)
    this.apisolverService.changeLines(this.lines)
    this.apisolverService.changeParameters(this.parameters) 
    this.messageFlag = false
    this.message = ""
  }

  async iniciarGrafico(){
    if( this.instanciaFlag == true){
      this.graficadoFlag = true;
      this.apisolverService.changeGraficoFlag(this.graficadoFlag);
      await this.ejecutarGup();
      await this.ejecutarGlw();
      this.data = [
        { x: this.lines.upperX, y: this.lines.upperY, type: 'scatter', mode: 'lines', name: 'Upper Bound', marker:{size:16} },
        { x: this.lines.lowerX, y: this.lines.lowerY, type: 'scatter', mode: 'lines', name: 'Lower Bound', marker:{size:16} },
      ]
      await this.ejecutarRun();
    }
  }
  
  async updateGrafico(){
    await this.ejecutarRun();
    this.data = [
      { x: this.lines.upperX, y: this.lines.upperY, type: 'scatter', mode: 'lines', name: 'Upper Bound', marker:{size:16} },
      { x: this.lines.lowerX, y: this.lines.lowerY, type: 'scatter', mode: 'lines', name: 'Lower Bound', marker:{size:16} },
    ]
    this.ejecutarGlw();
    this.ejecutarGup();
  }

  //Ejecuto el comando run
  async ejecutarRun(){
    if ( this.instanciaFlag == true){
      var instruccion = new Instruccion();
      instruccion.instruc = "run";
      instruccion.param = "100 " + this.precision.toString();
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        if( Object.prototype.hasOwnProperty.call(res, "code")){
          this.messageFlag = true;
          this.message = "Se ha producido un error de conexión con el solver, por favor actualizar la página";
          console.log("error!!")
        }else{
          this.comandList.push(instruccion.instruc + " " + instruccion.param + " " + instruccion. port)
          this.apisolverService.changeCommandList(this.comandList)
          console.log('ComandList: ', this.comandList)
        }
      });
    }
  }

  //Ejecuto el comando glw
  async ejecutarGlw(){
    if( this.instanciaFlag == true ){
      var instruccion = new Instruccion();
      instruccion.instruc = "glw";
      instruccion.param = " " + this.precision.toString();
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        console.log('res glw: ', res)
        if(Object.prototype.hasOwnProperty.call(res, "code")){
          this.activarMensaje("Se ha producido un error de conexión con el solver, por favor actualizar la página");
        }else{
          this.comandList.push(instruccion.instruc + " " + instruccion.param + " " + instruccion. port)
          this.apisolverService.changeCommandList(this.comandList)
          console.log('ComandList: ', this.comandList)
          console.log('res glw : x: ', res.x, ' y: ', res.y)
          if( res.x.length != 0){
            this.messageFlag = false
            this.message = ""
            this.lines.lowerX = res.x
            this.lines.lowerY = res.y
            this.changeLines()
          }else{
            this.messageFlag = true
            this.message = "No se están recibiendo valores del solver"
          }
        }
      });
    }
  }
    
  //Ejecuto el comando gup
  async ejecutarGup(){
    if( this.instanciaFlag == true){
      var instruccion = new Instruccion();
      instruccion.instruc = "gup";
      instruccion.param = " " + this.precision.toString();
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        if(Object.prototype.hasOwnProperty.call(res, "code")){
          this.activarMensaje("Se ha producido un error de conexión con el solver, por favor actualizar la página");
        }else{
          this.comandList.push(instruccion.instruc + " " + instruccion.param + " " + instruccion. port)
          this.apisolverService.changeCommandList(this.comandList)
          console.log('ComandList: ', this.comandList)
          console.log('res gup : x: ', res.x, ' y: ', res.y)
          if( res.x.length != 0){
            this.messageFlag = false
            this.message = ""
            this.lines.upperX = res.x
            this.lines.upperY = res.y
            this.changeLines()
          }else{
            this.messageFlag = true
            this.message = "No se están recibiendo valores del solver"
          }
        }
      });
    }
  }
    
  //Ejecuto el comando zoom
  async ejecutarZoo(x, y){
    if( this.instanciaFlag == true){
      var instruccion = new Instruccion();
      instruccion.instruc = "zoo ";
      instruccion.param = x.toString().slice(0, 8) + " " + y.toString().slice(0, 8) + " " + this.precision.toString().slice(0, 8);
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        if(Object.prototype.hasOwnProperty.call(res, "code")){
          this.messageFlag = true;
          this.message = "Se ha producido un error de conexión con el solver, por favor actualizar la página";
          console.log('error!')
        }else{
          console.log('entro al ejecutar zoo')
          this.comandList.push(instruccion.instruc + " " + instruccion.param + " " + instruccion. port)
          this.apisolverService.changeCommandList(this.comandList)
          console.log('ComandList: ', this.comandList)
          this.ejecutarRun();
          this.ejecutarGlw();
          this.ejecutarGup();
        }
      });
      await this.apisolverService.changeLines(this.lines)
    }
  }

  changeLines(){
    this.apisolverService.changeLines(this.lines)
  }

  changeParameters(){
    this.apisolverService.changeParameters(this.parameters)
  }

  stopSolver(){
      var instruccion = new Instruccion();
      instruccion.instruc = "fns";
      instruccion.param = "";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        this.comandList.push(instruccion.instruc + " " + instruccion.param + " " + instruccion. port)
        this.apisolverService.changeCommandList(this.comandList)
        console.log('ComandList: ', this.comandList)
      });
  }

  async getData(){
    await this.ejecutarRun();
    await this.ejecutarGlw();
    await this.ejecutarGup();
  }

  compare(a,b){
    if( a.x == b.x ){
      if( a.y == b.y){
        return 0
      }else if( a.y > b.y){
        return 1
      }else{
        return -1
      }
    }else if(a.x < b.x){
      return -1
    }else{
      return 1
    }
  }

  activarMensaje(texto){
    this.messageFlag = true;
    this.message = texto;
    console.log('error!!')
  }

  

}
