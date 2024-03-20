import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';

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
}
