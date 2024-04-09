import { TestBed } from '@angular/core/testing';

import { ClientInvoiceService } from './clientInvoice.service';

describe('ClientInvoiceService', () => {
  let service: ClientInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
