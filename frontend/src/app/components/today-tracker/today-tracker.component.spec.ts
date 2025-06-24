import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayTrackerComponent } from './today-tracker.component';

describe('TodayTrackerComponent', () => {
  let component: TodayTrackerComponent;
  let fixture: ComponentFixture<TodayTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
