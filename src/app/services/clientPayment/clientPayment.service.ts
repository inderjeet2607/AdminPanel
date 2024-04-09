import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientPaymentsService {
  private apiUrl = AppSettings.API_ENDPOINT + '/api/ClientPayments';

  constructor(private httpClient: HttpClient) {}

  public PostClientPayment(payment) {
    return this.httpClient.post<any>(this.apiUrl, payment).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public GetClientPaymentsByBusinessLocationId(BusinessLocationId) {
    return this.httpClient
      .get<any>(
        this.apiUrl +
          '/GetClientPaymentsByBusinessLocationId/' +
          BusinessLocationId
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
