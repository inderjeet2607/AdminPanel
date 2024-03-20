import { TestBed } from '@angular/core/testing';

import { BusinessLabelService } from './business-label.service';

describe('BusinessLabelService', () => {
  let service: BusinessLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
