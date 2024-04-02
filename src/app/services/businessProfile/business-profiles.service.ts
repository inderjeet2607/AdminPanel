import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessProfilesService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/BusinessProfiles";

  constructor(private httpClient: HttpClient) { }

  public GetBusinessLocationByGroupId(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetBusinessProfilesByGroupIDForAdminPanel/" + id).pipe();
  }

  public GetBusinessLocationById(id) {
    return this.httpClient.get<any>(this.apiUrl + "/" + id).pipe();
  }

  public PostBusinessProfile(businessProfile) {
    return this.httpClient.post<any>(this.apiUrl, businessProfile)
      .pipe(map(res => {
        return res;
      }));
  }

  public PutBusinessProfile(id, businessProfile) {
    return this.httpClient.put<any>(this.apiUrl + "/" + id, businessProfile)
      .pipe(map(res => {
        return res;
      }));
  }

  public EnableDisableBusinessProfile(id) {
    return this.httpClient.put<any>(this.apiUrl + "/EnableDisableBusinessProfile/" + id, null)
      .pipe(map(res => {
        return res;
      }));
  }
}
