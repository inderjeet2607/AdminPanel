import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../Constants';

@Injectable({
  providedIn: 'root'
})
export class UploadServiceService {
  private apiUrl = AppSettings.API_ENDPOINT + "/api/Promotions";
  constructor(private http: HttpClient) { }
  uploadBusinessImage(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.apiUrl}/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'text',
    });
    return this.http.request(req);
  }
}
