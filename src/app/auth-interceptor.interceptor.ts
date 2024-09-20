import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private _Route: Router) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isTokenExpired()) {
      localStorage.clear();
      this._Route.navigate(['login']);
      return throwError('Token expired');
    }

    const jwtToken = localStorage.getItem('access_token');
    if (jwtToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          localStorage.clear();
          this._Route.navigate(['login']);
        }
        return throwError(error);
      })
    );
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false; // No token means expired or not logged in
    }

    try {
      const decoded: any = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000); // Convert exp to milliseconds
      return expirationDate < new Date();
    } catch (error) {
      return true; // Decoding failed, assume expired
    }
  }
}
