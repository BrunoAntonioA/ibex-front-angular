import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { Instruccion } from './instruccion.model';
import { Lines } from '../lines.model';
import { Parameters } from '../parameters.model';

@Injectable({
  providedIn: 'root'
})

export class ApisolverService {

  private parametersSource = new BehaviorSubject<Parameters>(new Parameters);  
  currentParameters = this.parametersSource.asObservable();

  private linesSource = new BehaviorSubject<Lines>(new Lines);
  currentLines = this.linesSource.asObservable();

  private instanciaFlag = new BehaviorSubject<Boolean>(false);
  currentInstanciaFlag = this.instanciaFlag.asObservable();

  private graficoFlag = new BehaviorSubject<Boolean>(false);
  currentGraficoFlag = this.graficoFlag.asObservable();

  private commandList = new BehaviorSubject<string[]>([]);
  currentComandList = this.commandList.asObservable();

  readonly baseURL = 'http://localhost:3000/tesis/instruccion';

  constructor(private http: HttpClient) { }

  changeCommandList(value){
    this.commandList.next(value)
  }

  changeGraficoFlag(value: Boolean){
    this.graficoFlag.next(value);
  }

  changeInstanciaFlag(value: Boolean){
    this.instanciaFlag.next(value);
  }

  changeLines(lines: Lines){
    this.linesSource.next(lines)
  }

  changeParameters(parameters: Parameters){
    this.parametersSource.next(parameters)
  }

  postInstruction(instruccion : Instruccion){
    return this.http.post(this.baseURL, instruccion);
  }

  getPort(){
    return this.http.get(this.baseURL+'/port')
  }

  setInstance(filename : string, base : string, string : string){
    return this.http.post(base + 'crearInstancia/' + filename, {"string" : string, "port" : parseInt(sessionStorage.getItem('port'))});
  }

  updateData(oldX, oldY, opt){
    return this.http.post('http://localhost:3000/tesis/updateData', {oldX: oldX, oldY: oldY, opt: opt,  port: parseInt(sessionStorage.getItem('port'))})
  }
}
