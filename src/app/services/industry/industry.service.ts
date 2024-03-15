import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {
  private apiUrl = AppSettings.API_ENDPOINT + "/api/IndustryTypes";

  constructor(private httpClient: HttpClient) { }

  public GetIndustries() {
    return this.httpClient.get<any>(this.apiUrl).pipe();
  }
}
