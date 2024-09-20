import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../Constants';
import { map } from 'rxjs';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient, private router: Router) { }

  private apiUrl = AppSettings.API_ENDPOINT + "/api/Users/";

  public Login(details) {
    return this._http.post<any>(this.apiUrl + "GetUserByUserName", details)
        .pipe(map(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('access_token', String(user.accessToken));
            var x = jwt_decode.jwtDecode(user.accessToken);
            return user;
        }));
}

}
