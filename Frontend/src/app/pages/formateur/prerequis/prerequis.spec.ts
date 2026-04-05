import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prerequis } from './prerequis';

describe('Prerequis', () => {
  let component: Prerequis;
  let fixture: ComponentFixture<Prerequis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prerequis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prerequis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
