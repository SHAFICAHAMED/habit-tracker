import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Log } from '../models/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl='http://localhost:5000/api/logs'

  constructor(private http:HttpClient) { }

  markHabit(log:Log):Observable<Log>{
    return this.http.post<Log>(this.apiUrl,log);
  }

  getLogsByDate(date:string):Observable<Log[]>{
    return this.http.get<Log[]>(`${this.apiUrl}/${date}`)
  }


}
