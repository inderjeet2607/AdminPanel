import { TestBed } from '@angular/core/testing';

import { PaymentDocsService } from './payment-docs.service';

describe('PaymentDocsService', () => {
  let service: PaymentDocsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentDocsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
