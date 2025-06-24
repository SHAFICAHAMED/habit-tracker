import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitFormComponent } from "./components/habit-form/habit-form.component";
import { ProgressGraphComponent } from './components/progress-graph/progress-graph.component';
import { TodayTrackerComponent } from './components/today-tracker/today-tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HabitFormComponent,ProgressGraphComponent,TodayTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
