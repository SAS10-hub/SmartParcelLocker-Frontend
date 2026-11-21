import { TestBed } from '@angular/core/testing';

import { ReservationData } from './reservation-data';

describe('ReservationData', () => {
  let service: ReservationData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
