import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Session } from './session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly baseURL = 'http://localhost:3020/sessions';

  constructor(private http: HttpClient) { }

  postSession(session : Session){
    return this.http.post(this.baseURL, session);
  }

  getSessionList() {
    return this.http.get(this.baseURL);
  }

  getSessionId(_id: string){
    return this.http.get(this.baseURL + `/${_id}`);
  }


  putSession(session : Session) {
    return this.http.put(this.baseURL + `/${session._id}`, session);
  }

  deleteSession(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }
}
