import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ibex } from './ibex.model';

@Injectable({
  providedIn: 'root'
})
export class IbexService {

  selectedIbex: Ibex;

  functions : string[] = []
  domains : any[] = []
  constraints : string[] = []
  constants: string[] = []

  // For checking all the variables domains in the domains
  domainVariablesNames: string[] = []

  // For checking all the variables names in functions
  functionVariablesNames: string[] = []

  // To check all constants names
  constantVariableNames: string[] = []
  
  selectedConstant: {
    index: 0,
    name: string,
    infValue: Number,
    supValue: Number
  }

  selectedFunction: {
    index: 0,
    value: string
  }

  selectedDomain: {
    index: 0,
    var: string,
    infValue: Number,
    supValue: Number,
  }
  selectedConstraint: {
    index: 0,
    value: string
  } 

  readonly baseURL = 'http://localhost:3020/ibexs';

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.selectedConstraint = {
      index: 0,
      value: ""
    }
    this.selectedDomain = {
      index: 0,
      var: "",
      infValue: 0,
      supValue: 0
    }
    this.selectedFunction = {
      index: 0,
      value: ""
    } 
    this.selectedConstant = {
      index: 0,
      name: "",
      infValue: 0,
      supValue: 0
    }
  }

  postIbex(ibex : Ibex){
    return this.http.post(this.baseURL, ibex);
  }

  getIbexList() {
    return this.http.get(this.baseURL);
  }

  getIbexId(_id: string){
    return this.http.get(this.baseURL + `/${_id}`);
  }


  putIbex(ibex : Ibex) {
    return this.http.put(this.baseURL + `/${ibex._id}`, ibex);
  }

  deleteIbex(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}
