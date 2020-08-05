import { Component, OnInit, ViewChild, ElementRef, Output} from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { EventEmitter, HostListener, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

import { interval, timer, fromEvent } from 'rxjs';

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
  public data: any[] = [
  ];
  public layout: any = {
  };


  parameters: Parameters;
  lines: Lines;
  commandFlag: Number;
  graficadoFlag: Boolean;
  instanciaFlag: Boolean;
  gupFlag: Boolean;
  glwFlag: Boolean;


  constructor(private apisolverService: ApisolverService, private renderer: Renderer2) { }

  pushSortedSet(){
    console.log('pushSortedSet()')
  }

  zoomGraph(eventData){
    console.log(eventData.points)
    this.layout = {
      yaxis : {
        range : [eventData.range.y[0], eventData.range.y[1]]
      },
      xaxis : {
        range: [eventData.range.x[0], eventData.range.x[1]]
      }
    }

    //this.ejecutarZoo(eventData.range.x[0], eventData.range.y[0], eventData.range.x[1], eventData.range.y[1])
    
    console.log(eventData.range.x[0])
    console.log(eventData.range.x[1])
    console.log(eventData.range.y[0])
    console.log(eventData.range.y[1])

  }

  zoomOut(){
    this.layout = {

    }
  }

  async ngOnInit() {
    this.apisolverService.currentLines.subscribe(lines => this.lines = lines)
    this.apisolverService.currentParameters.subscribe(parameters => this.parameters = parameters)
    this.apisolverService.currentGraficoFlag.subscribe(graficadoFlag => this.graficadoFlag = graficadoFlag)
    this.apisolverService.currentInstanciaFlag.subscribe(instanciaFlag => this.instanciaFlag = instanciaFlag)
    this.initializeVariables()

  }
  
  //Instanciacion de variables e iniciado de graficado
  async ngAfterViewInit(){
    //this.getPuntosIniciales();

    this.commandFlag = 0;
    this.gupFlag = false;
    this.glwFlag = false;

    const contador = interval(10000);
    contador.subscribe(() => {
      this.ejecutarRun();
    });
  }

  ngAfterContentChecked(){
  }

  ngAfterViewCheck(){
  }

  async initializeVariables(){
    this.parameters = new Parameters()
    this.parameters.constraints = []
    this.parameters.domains = []
    this.parameters.fnctions = []
    this.lines = new Lines()
    this.lines.upperX = [1, 2, 3, 4]
    this.lines.upperY = [1, 2, 3, 4]
    this.lines.lowerX = [1, 2, 3, 4]
    this.lines.lowerY = [3, 6, 9, 12]
    this.apisolverService.changeLines(this.lines)
    this.apisolverService.changeParameters(this.parameters)
  }

  async iniciarGrafico(){
    this.graficadoFlag = true;
    this.apisolverService.changeGraficoFlag(this.graficadoFlag);


    this.data = [
      { x: this.lines.upperX, y: this.lines.upperY, type: 'scattergl', mode: 'lines+markers', name: 'Upper Bound' },
      { x: this.lines.lowerX, y: this.lines.lowerY, type: 'markers', mode: 'lines+markers', name: 'Lower Bound' },
    ]

    //await this.ejecutarGup();
    //await this.ejecutarRun();
    //await this.ejecutarGlw();
    
  }

  updateGrafico(){

    this.data = [
      { x: this.lines.upperX, y: this.lines.upperY, type: 'scattergl', mode: 'lines+markers', name: 'Upper Bound' },
      { x: this.lines.lowerX, y: this.lines.lowerY, type: 'markers', mode: 'lines+markers', name: 'Lower Bound' },
    ]

    //await this.ejecutarGup();
    //await this.ejecutarRun();
    //await this.ejecutarGlw();

  }


  //Obtención de puntos iniciales
  async getPuntosIniciales(){
    await this.ejecutarRun()
    await this.ejecutarGlw()
    await this.ejecutarGup()
  }

  //Ejecuto el comando run
  async ejecutarRun(){
    if( this.commandFlag == 0){
      this.commandFlag = 1;
      var instruccion = new Instruccion();
      instruccion.instruc = "run";
      instruccion.param = "100 0.1";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
      });
      this.commandFlag = 0;
    }
  }

  //Ejecuto el comando glw
  async ejecutarGlw(){
    if(this.commandFlag == 0){
      this.commandFlag = 1;
      var instruccion = new Instruccion();
      instruccion.instruc = "glw";
      instruccion.param = "";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        res.add.forEach(vector => {
          if ( vector.x != null && vector.y != null){
            this.lines.lowerX.push(parseFloat(vector.x))
            this.lines.lowerY.push(parseFloat(vector.y))
          }
        });
        res.remove.forEach(vector => {
          if ( vector.x != null && vector.y != null){
            this.removerPunto(parseFloat(vector.x), parseFloat(vector.y), this.lines.upperX, this.lines.upperY)
          }
        });
      });
      await this.apisolverService.changeLines(this.lines)
      this.commandFlag = 0;
      this.glwFlag = true;
    }
  }

  //Ejecuto el comando gup
  async ejecutarGup(){
    if( this.commandFlag == 0){
      this.commandFlag = 1;
      var instruccion = new Instruccion();
      instruccion.instruc = "gup";
      instruccion.param = "";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        res.add.forEach(vector => {
          if ( vector.x != null && vector.y != null){
            this.lines.upperX.push(parseFloat(vector.x))
            this.lines.upperY.push(parseFloat(vector.y))
          }
        });
        res.remove.forEach(vector => {
          if ( vector.x != null && vector.y != null){
            this.removerPunto(parseFloat(vector.x), parseFloat(vector.y), this.lines.upperX, this.lines.upperY)
          }
        });
      });
      await this.apisolverService.changeLines(this.lines)
      this.commandFlag = 0;
      this.gupFlag = true;
    }
  }

  //Ejecuto el comando zoom
  async ejecutarZoo(x1, y1, x2, y2){
    if( this.commandFlag == 0){
      this.commandFlag = 1;
      var instruccion = new Instruccion();
      instruccion.instruc = "zoo";
      instruccion.param = x1.toString() + " " + y1.toString() + " " + "1e-2";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      await this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
        this.ejecutarRun();
        this.ejecutarGlw();
        this.ejecutarGup();
      });
      await this.apisolverService.changeLines(this.lines)
      this.commandFlag = 0;
      this.gupFlag = true;
    }
  }

  removerPunto(x, y, traceX, traceY){
    let index = traceX.indexOf(x)
    if( index != -1){
      traceX.splice(index, 1)
      traceY.splice(index, 1)
    }else{
      console.log('este punto no esta')
    }
  }

  changeLines(){
    this.apisolverService.changeLines(this.lines)
  }

  changeParameters(){
    this.apisolverService.changeParameters(this.parameters)
  }

  stopSolver(){
    if( this.commandFlag == 0){
      this.commandFlag = 1;
      var instruccion = new Instruccion();
      instruccion.instruc = "fns";
      instruccion.param = "";
      instruccion.port = parseInt(sessionStorage.getItem('port'));
      this.apisolverService.postInstruction(instruccion).subscribe((res : any) =>{
      });
    }
  }

  async getData(){
    await this.ejecutarRun();
    await this.ejecutarGlw();
    await this.ejecutarGup();
  }

  compare(a,b){
    if( a.x == b.x ){
      return 0
    }else if(a.x < b.x){
      return -1
    }else{
      return 1
    }
  }

  

}
