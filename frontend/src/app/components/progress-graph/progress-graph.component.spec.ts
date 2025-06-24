import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressGraphComponent } from './progress-graph.component';

describe('ProgressGraphComponent', () => {
  let component: ProgressGraphComponent;
  let fixture: ComponentFixture<ProgressGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
