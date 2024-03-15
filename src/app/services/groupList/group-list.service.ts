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
}
