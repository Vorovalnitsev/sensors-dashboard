import { TestBed } from '@angular/core/testing';

import { SensorsService } from './sensors.service';

describe('SensorService', () => {
  let service: SensorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
