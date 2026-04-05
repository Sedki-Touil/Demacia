import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLeft } from './auth-left';

describe('AuthLeft', () => {
  let component: AuthLeft;
  let fixture: ComponentFixture<AuthLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLeft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthLeft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
