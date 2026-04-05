import { TestBed } from '@angular/core/testing';

import { Apprenant } from './apprenant';

describe('Apprenant', () => {
  let service: Apprenant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Apprenant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
