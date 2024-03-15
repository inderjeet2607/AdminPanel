import { Injectable } from '@angular/core';
import { AppSettings } from '../Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageTypeService {
  private apiUrl = AppSettings.API_ENDPOINT + "/api/PackageTypes";

  constructor(private httpClient: HttpClient) { }

  public GetPackageTypes() {
    return this.httpClient.get<any>(this.apiUrl).pipe();
  }
}
