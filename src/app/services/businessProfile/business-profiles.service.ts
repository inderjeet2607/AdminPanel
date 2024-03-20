import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BusinessProfilesService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/BusinessProfiles";

  constructor(private httpClient: HttpClient) { }

  public GetBusinessLocationByGroupId(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetBusinessProfilesByGroupID/" + id).pipe();
  }

  public GetBusinessLocationById(id) {
    return this.httpClient.get<any>(this.apiUrl + "/" + id).pipe();
  }
}
