import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  private apiUrl = AppSettings.API_ENDPOINT + "/api/Sources";

  constructor(private httpClient: HttpClient) { }

  public GetSourcesByBusinessGroupID(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetSourcesByBusinessGroupID/" + id).pipe();
  }

  public GetSourcesByIDForAdminPanel(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetSourcesByIDForAdminPanel/" + id).pipe();
  }

  public GetSourceCountByLocationID(id) {
    return this.httpClient.get<any>(this.apiUrl + "/GetSourceCountByLocationID/" + id).pipe();
  }

  public PostSourcesForAdminPanel(sources) {
    return this.httpClient.post<any>(this.apiUrl + "/PostSourcesForAdminPanel", sources)
      .pipe(map(res => {
        return res;
      }));
  }

  public PutSourcesForAdminPanel(id, sources) {
    return this.httpClient.put<any>(this.apiUrl + "/PutSourcesForAdminPanel/" + id, sources)
      .pipe(map(res => {
        return res;
      }));
  }
}
