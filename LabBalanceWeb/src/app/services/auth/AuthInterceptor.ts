import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserStorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userStorageService: UserStorageService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userStorageService.getToken();
    console.log("Token:", token);

    // If the token exists and is expired, log out the user
    if (token && this.userStorageService.isTokenExpired()) {
      console.log("Token is expired, logging out...");
      this.userStorageService.signOut();
      this.router.navigate(['/login']);
      return throwError('JWT token is expired');
    }

    // Clone the request and set the Authorization header
    let clonedRequest = req;
    if (token) {
      clonedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // JWT is expired or invalid, log out the user and redirect to login
          console.log("Received 401, logging out...");
          this.userStorageService.signOut();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
