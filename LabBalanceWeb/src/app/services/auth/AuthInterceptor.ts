import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStorageService } from '../storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userStorageService: UserStorageService) {}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.userStorageService.getToken(); // Ensure this returns a string
    console.log("Token:", token);

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
