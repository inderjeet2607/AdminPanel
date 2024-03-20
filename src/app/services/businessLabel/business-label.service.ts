import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessLabelService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/BusinessLabels";

  constructor(private httpClient: HttpClient) { }

  public GetBusinessLabels() {
    return this.httpClient.get<any>(this.apiUrl).pipe();
  }
}
