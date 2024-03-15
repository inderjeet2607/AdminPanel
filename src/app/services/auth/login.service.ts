import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  private apiUrl = AppSettings.API_ENDPOINT + "/api/Users/";

  public Login(userName: string, password: string) {
    return this.httpClient.get<any>(this.apiUrl + userName + "/" + password)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }));
  } 
}
