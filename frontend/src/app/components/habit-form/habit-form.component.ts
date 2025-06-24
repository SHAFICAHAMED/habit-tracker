// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Habit } from '../../models/habit';
// import { HabitService } from '../../services/habit.service';

// @Component({
//   selector: 'app-habit-form',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './habit-form.component.html',
//   styleUrl: './habit-form.component.scss',
//   animations: [
//     trigger('fadeInSlide', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(-20px)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
//       ])
//     ])
//   ]
// })
// export class HabitFormComponent implements OnInit {
//   habits: Habit[] = [];

//   newHabit: Habit = {
//     title: '',
//     goal: 'daily'
//   };

//   constructor(private habitService: HabitService) {}

//   ngOnInit(): void {
//     this.loadHabits();
//   }

//   loadHabits(): void {
//     this.habitService.getAllHabits().subscribe({
//       next: (habits) => {
//         console.log('Loaded habits:', habits);
//         this.habits = habits;
//       },
//       error: (err) => {
//         console.error('Error loading habits:', err);
//       }
//     });
//   }

//   addHabit(): void {
//     // 🛑 Fix this logic
//     if (!this.newHabit.title.trim()) {
//       console.warn('Cannot add habit without a title');
//       return;
//     }

//     console.log('Sending new habit to API:', this.newHabit);

//     this.habitService.addHabit(this.newHabit).subscribe({
//       next: (added) => {
//         console.log('Habit added:', added);
//         this.newHabit.title = '';
//         this.loadHabits();
//       },
//       error: (err) => {
//         console.error('Error adding habit:', err);
//       }
//     });
//   }

//   deleteHabit(id: string): void {
//     console.log('Deleting habit with ID:', id);
//     this.habitService.deleteHabit(id).subscribe({
//       next: () => {
//         console.log('Habit deleted');
//         this.loadHabits();
//       },
//       error: (err) => {
//         console.error('Error deleting habit:', err);
//       }
//     });
//   }
// }




import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './habit-form.component.html',
  styleUrl: './habit-form.component.scss',
  animations: [
    trigger('fadeInSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class HabitFormComponent implements OnInit {
  habits: Habit[] = [];
  showModal = false;

  newHabit: Habit = {
    title: '',
    goal: 'daily'
  };

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.loadHabits();
  }

  loadHabits(): void {
    this.habitService.getAllHabits().subscribe({
      next: (habits) => {
        this.habits = habits;
      },
      error: (err) => {
        console.error('Error loading habits:', err);
      }
    });
  }

  addHabit(): void {
    if (!this.newHabit.title.trim()) {
      console.warn('Cannot add habit without a title');
      return;
    }

    this.habitService.addHabit(this.newHabit).subscribe({
      next: (added) => {
        this.newHabit = { title: '', goal: 'daily' };
        this.loadHabits();
        this.showModal = false;
      },
      error: (err) => {
        console.error('Error adding habit:', err);
      }
    });
  }

  deleteHabit(id: string): void {
    this.habitService.deleteHabit(id).subscribe({
      next: () => {
        this.loadHabits();
      },
      error: (err) => {
        console.error('Error deleting habit:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
