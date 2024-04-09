import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentDocsService {
  private apiUrl = AppSettings.API_ENDPOINT + "/api/LocationwisePaymentDocs";

  constructor(private httpClient: HttpClient) { }

  public GetLocationDocsByPaymentID(businessLocationID) {
    return this.httpClient.get<any>(this.apiUrl + "/GetLocationDocsByPaymentID/" + businessLocationID).pipe();
  }

  public PostLocationwisePaymentDocs(details) {
    return this.httpClient.post<any>(this.apiUrl, details)
      .pipe(map(res => {
        return res;
      }));
  }

  public PutLocationwisePaymentDocs(id, details) {
    return this.httpClient.put<any>(this.apiUrl + '/' + id, details)
      .pipe(map(res => {
        return res;
      }));
  }

  public DeleteLocationwisePaymentDocs(id) {
    return this.httpClient.delete<any>(this.apiUrl + "/" + id)
      .pipe(map(res => {
        return res;
      }));
  }
}
