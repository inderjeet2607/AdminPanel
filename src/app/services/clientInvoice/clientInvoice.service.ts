import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientInvoiceService {
  private apiUrl = AppSettings.API_ENDPOINT + '/api/ClientInvoices';

  constructor(private httpClient: HttpClient) {}

  public PostClientInvoice(invoice) {
    return this.httpClient.post<any>(this.apiUrl, invoice).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public GetClientInvoicesByBusinessLocationId(BusinessLocationId) {
    return this.httpClient
      .get<any>(
        this.apiUrl +
          '/GetClientInvoicesByBusinessLocationId/' +
          BusinessLocationId
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
