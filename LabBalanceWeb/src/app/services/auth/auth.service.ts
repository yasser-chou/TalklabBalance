import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

const BASIC_URL = 'http://localhost:8080/';
export const AUTH_HEADER = 'authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService,
    private router: Router
  ) {}

  registerClient(signupRequestDTO: any): Observable<any> {
    return this.http.post(BASIC_URL + 'client/sign-up', signupRequestDTO);
  }

  login(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post(BASIC_URL + 'authenticate', { username, password }, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          const token = res.body.token;
          if (token) {
            this.userStorageService.saveToken(token);
          } else {
            console.error('Token not found in the response body');
          }
          return res;
        })
      );
  }

  isAuthenticated(): boolean {
    if (this.userStorageService.isTokenExpired()) {
      this.logout(); // Automatically log out if the token is expired
      return false;
    }
    return true;
  }

  logout(): void {
    this.userStorageService.signOut();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.userStorageService.getToken();
  }
}
