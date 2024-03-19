import { TestBed } from '@angular/core/testing';

import { BusinessProfilesService } from './business-profiles.service';

describe('BusinessProfilesService', () => {
  let service: BusinessProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
