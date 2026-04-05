import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantDashboard } from './apprenant-dashboard';

describe('ApprenantDashboard', () => {
  let component: ApprenantDashboard;
  let fixture: ComponentFixture<ApprenantDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenantDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenantDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
