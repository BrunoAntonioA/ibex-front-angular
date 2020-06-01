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

  selectedFunction: string;
  selectedDomain: string;
  selectedConstraint: string;

  readonly baseURL = 'http://localhost:3020/ibexs';

  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.selectedConstraint = ""
    this.selectedDomain = ""
    this.selectedFunction = ""
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
