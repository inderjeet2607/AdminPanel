import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = AppSettings.API_ENDPOINT + "/api/States";

  constructor(private httpClient: HttpClient) { }

  public GetStates() {
    return this.httpClient.get<any>(this.apiUrl).pipe();
  }
}
