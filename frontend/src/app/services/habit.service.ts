import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
    private apiUrl='https://habit-tracker-vtdu.onrender.com/api/habits'
  constructor(private http:HttpClient) { }

  getAllHabits():Observable<Habit[]>{
    return this.http.get<Habit[]>(this.apiUrl);
  }

  addHabit(habit:Habit):Observable<Habit>{
    return this.http.post<Habit>(this.apiUrl,habit);
  }

  deleteHabit(id:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
