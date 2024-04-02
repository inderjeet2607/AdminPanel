import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupListService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/BusinessGroups";

  constructor(private httpClient: HttpClient) { }

  public GetBusinessGroups() {
    return this.httpClient.get<any>(this.apiUrl + '/GetBusinessGroupsForAdminPanel').pipe();
  }

  public PostBusinessGroupForAdminPanel(group) {
    return this.httpClient.post<any>(this.apiUrl + '/PostBusinessGroupForAdminPanel', group)
      .pipe(map(res => {
        return res;
      }));
  }

  public GetBusinessGroupByID(id) {
    return this.httpClient.get<any>(this.apiUrl + '/GetBusinessGroupByID/' + id).pipe();
  }

  public PutBusinessGroupForAdminPanel(id, details) {
    return this.httpClient.put<any>(this.apiUrl + '/PutBusinessGroupForAdminPanel/' + id, details)
      .pipe(map(res => {
        return res;
      }));
  }

  public EnableDisableBusinessGroupForAdminPanel(id, details) {
    return this.httpClient.put<any>(this.apiUrl + '/EnableDisableBusinessGroupForAdminPanel/' + id, details)
      .pipe(map(res => {
        return res;
      }));
  }

  public CheckIfBusinessGroupExists(id, businessGroupName) {
    return this.httpClient.get<any>(this.apiUrl + '/CheckIfBusinessGroupExists/' + id + '/' + businessGroupName).pipe();
  }
}
