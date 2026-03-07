import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apprenant } from './apprenant';

describe('Apprenant', () => {
  let component: Apprenant;
  let fixture: ComponentFixture<Apprenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apprenant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Apprenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
