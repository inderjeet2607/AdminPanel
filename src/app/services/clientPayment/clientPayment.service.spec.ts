import { TestBed } from '@angular/core/testing';

import { ClientPaymentsService } from './clientPayment.service';

describe('ClientInvoiceService', () => {
  let service: ClientPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
