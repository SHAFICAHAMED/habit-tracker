import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../services/habit.service';
import { LogService } from '../../services/log.service';
import { Habit } from '../../models/habit';
import { Log } from '../../models/log';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ChartData {
  name: string;
  value: number;
}

interface StreakData {
  current: number;
  best: number;
}

@Component({
  selector: 'app-today-tracker',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxChartsModule],
  templateUrl: './today-tracker.component.html',
  styleUrl: './today-tracker.component.scss'
})
export class TodayTrackerComponent implements OnInit {
  habits: Habit[] = [];
  logs: { [habitId: string]: 'Complete' | 'NotComplete' } = {};
  streaks: { [habitId: string]: StreakData } = {};
  today: string = new Date().toISOString().split('T')[0];

  constructor(private habitServive: HabitService, private logService: LogService) {}

  ngOnInit(): void {
    this.loadHabits();
    this.loadLogs();
  }

  loadHabits() {
    this.habitServive.getAllHabits().subscribe(habits => {
      this.habits = habits;
      this.updateChartData();
    });
  }

  loadLogs() {
    this.logService.getLogsByDate(this.today).subscribe(data => {
      data.forEach(log => {
        this.logs[log.habitId] = log.status;
      });
      this.calculateStreaks();
    });
  }

  markStatus(habitId: string, status: 'Complete' | 'NotComplete') {
    this.logs[habitId] = status;

    const log: Log = {
      habitId,
      date: this.today,
      status
    };

    this.logService.markHabit(log).subscribe(() => {
      this.updateChartData();
      this.calculateStreaks();
    });
  }

  getHabitTheme(habit: Habit) {
    if (habit.title.toLowerCase().includes('programming')) {
      return { icon: '🏃‍♂️', color: '#FFD700' };
    } else if (habit.title.toLowerCase().includes('game')) {
      return { icon: '🏠', color: '#9370DB' };
    } else {
      return { icon: '🌀', color: '#00CED1' };
    }
  }

  calculateStreaks(): void {
    const endDate = new Date(this.today);
    const daysToCheck = 30;

    this.habits.forEach(habit => {
      let current = 0;
      let best = 0;
      let streak = 0;

      for (let i = 0; i < daysToCheck; i++) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        this.logService.getLogsByDate(dateStr).subscribe(logs => {
          const match = logs.find(l => l.habitId === habit._id && l.status === 'Complete');

          if (match) {
            streak++;
            if (i === 0) current++;
          } else {
            best = Math.max(best, streak);
            streak = 0;
          }

          if (i === daysToCheck - 1) {
            best = Math.max(best, streak);
            this.streaks[habit._id!] = { current, best };
          }
        });
      }
    });
  }

  completionData: ChartData[] = [];
  completionRate = 0;

  updateChartData(): void {
    const total = this.habits.length;
    const completed = this.habits.filter(h => this.logs[h._id!] === 'Complete').length;
    const missed = this.habits.filter(h => this.logs[h._id!] === 'NotComplete').length;

    this.completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    this.completionData = [
      { name: '✅ Done', value: completed },
      { name: '❌ Missed', value: missed },
      { name: '🕗 Remaining', value: total - completed - missed }
    ];
  }

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28a745', '#dc3545', '#ffc107']
  };

  exportToPDF(): void {
    const trackerElement = document.querySelector('.tracker-container') as HTMLElement;

    if (!trackerElement) {
      console.error('Tracker container not found!');
      return;
    }

    html2canvas(trackerElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Habit_Report_${new Date().toLocaleDateString()}.pdf`);
    });
  }
}
