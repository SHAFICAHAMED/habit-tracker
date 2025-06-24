import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { LogService } from '../../services/log.service';
import { Log } from '../../models/log';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface HabitStreak {
  habitId: string;
  currentStreak: number;
  bestStreak: number;
}

@Component({
  selector: 'app-progress-graph',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FormsModule],
  templateUrl: './progress-graph.component.html',
  styleUrl: './progress-graph.component.scss'
})
export class ProgressGraphComponent implements OnInit {
  chartLabels: string[] = [];
  chartData: number[] = [];

  averageCompletion: number = 0;
  habitStreaks: HabitStreak[] = [];

  chartConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: this.chartLabels,
      datasets: [
        {
          label: '% Completed',
          data: this.chartData,
          backgroundColor: '#00ff99',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          labels: { color: '#fff' }
        },
        tooltip: {
          backgroundColor: '#33334d',
          titleColor: '#00ff99',
          bodyColor: '#fff'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#ccc' },
          grid: { color: '#444' }
        },
        x: {
          ticks: { color: '#ccc' },
          grid: { color: '#444' }
        }
      }
    }
  };

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    const today = new Date();
    const last7Days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formatted = date.toISOString().split('T')[0];
      last7Days.push(formatted);
    }

    Promise.all(
      last7Days.map(date => this.logService.getLogsByDate(date).toPromise())
    ).then((results: (Log[] | undefined)[]) => {
      this.chartLabels = last7Days;

      // Average % completed each day
      this.chartData = results.map(logs => {
        const safeLogs = logs ?? [];
        const doneCount = safeLogs.filter(l => l.status === 'Complete').length;
        return safeLogs.length ? Math.round((doneCount / safeLogs.length) * 100) : 0;
      });

      const validValues = this.chartData.filter(v => !isNaN(v));
      const total = validValues.reduce((a, b) => a + b, 0);
      this.averageCompletion = validValues.length ? Math.round(total / validValues.length) : 0;

      // ✅ Habit streak tracking
      const habitLogsMap: { [habitId: string]: string[] } = {};

      // Collect status for each habit by date
      last7Days.forEach((date, index) => {
        const logs = results[index] ?? [];
        logs.forEach(log => {
          if (!habitLogsMap[log.habitId]) {
            habitLogsMap[log.habitId] = [];
          }
          habitLogsMap[log.habitId].push(log.status);
        });
      });

      // Calculate streaks for each habit
      this.habitStreaks = Object.entries(habitLogsMap).map(([habitId, statusList]) => {
        let current = 0;
        let best = 0;
        let temp = 0;

        statusList.forEach(status => {
          if (status === 'Complete') {
            temp++;
            best = Math.max(best, temp);
          } else {
            temp = 0;
          }
        });

        // Current streak = count of completes until last day
        current = 0;
        for (let i = statusList.length - 1; i >= 0; i--) {
          if (statusList[i] === 'Complete') {
            current++;
          } else break;
        }

        return { habitId, currentStreak: current, bestStreak: best };
      });

      this.chartConfig.data!.labels = this.chartLabels;
      this.chartConfig.data!.datasets[0].data = this.chartData;
    });
  }

  exportGraphToPDF(): void {
    const graphElement = document.querySelector('.graph-container') as HTMLElement;
    if (!graphElement) return;

    html2canvas(graphElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Habit_Progress_${new Date().toLocaleDateString()}.pdf`);
    });
  }
}
