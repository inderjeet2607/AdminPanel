import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { StripeService } from 'ngx-stripe';

declare const Stripe;

@Injectable({
  providedIn: 'root'
})
export class PaymentInfoService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/PaymentInfoes";

  constructor(private httpClient: HttpClient) { }

  public GetPaymentInfoesByBusinessGroupID(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetPaymentInfoesByBusinessGroupID/" + id).pipe();
  }

  public GetPaymentInfoByID(id) {
    return this.httpClient.get<any>(this.apiUrl + "/" + id).pipe();
  }

  public PostPaymentInfo(paymentInfo) {
    return this.httpClient.post<any>(this.apiUrl, paymentInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  public PutPaymentInfo(id, paymentInfo) {
    return this.httpClient.put<any>(this.apiUrl + "/" + id, paymentInfo)
      .pipe(map(res => {
        return res;
      }));
  }

  public DeletePaymentInfo(id) {
    return this.httpClient.delete(this.apiUrl + "/" + id)
      .pipe(map(res => {
        return res;
      }));
  }
}
