import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Instruccion } from './instruccion.model';

@Injectable({
  providedIn: 'root'
})
export class ApisolverService {

  readonly baseURL = 'http://localhost:3000/tesis/instruccion';

  constructor(private http: HttpClient) { }

  postInstruction(instruccion : Instruccion){
    return this.http.post(this.baseURL, instruccion);
  }

  setInstance(filename : string, base : string, string : string){
    return this.http.post(base + 'crearInstancia/' + filename, {"string" : string, "port" : 8000});
  }
}
