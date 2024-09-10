import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import { UserStorageService } from '../storage/storage.service';
import { Router } from '@angular/router';
import {catchError} from "rxjs/operators";

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

  private baseUrl = '/api/images';

  registerClient(signupRequestDTO: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('username', signupRequestDTO.username);
    formData.append('firstname', signupRequestDTO.firstname);
    formData.append('lastname', signupRequestDTO.lastname);
    formData.append('phone', signupRequestDTO.phone);
    formData.append('password', signupRequestDTO.password);
    if (file) {
      formData.append('file', file);
    }

    return this.http.post(BASIC_URL + 'client/sign-up', formData).pipe(
      catchError(error => {
        console.error('Registration error:', error.message || error);
        return throwError(error);
      })
    );
  }




  login(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(BASIC_URL + 'authenticate', { username, password }, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          console.log('Full login response:', res.body);  // Debugging: Check the entire backend response

          const token = res.body.token;
          const userId = res.body.userId;
          const firstname = res.body.firstname;
          const lastname = res.body.lastname;
          const profilePicture = res.body.profilePicture;

          if (token) {
            this.userStorageService.saveToken(token);
          } else {
            console.error('Token not found in the response body');
          }

          if (userId && firstname && lastname) {
            const userDetails = {
              userId: userId,
              firstname: firstname,
              lastname: lastname,
              profilePicture: profilePicture || null
            };
            this.userStorageService.saveUser(userDetails);
            console.log('User details saved to localStorage:', userDetails);
          } else {
            console.error('User details not found in the response body');
          }

          return res;
        }),
        catchError(error => {
          console.error('Login error:', error);  // Log full error object
          return throwError(error);
        })
      );
  }


  getImage(filename: string): Observable<Blob> {
    return this.http.get(`http://localhost:8080/images/${filename}`, { responseType: 'blob' });
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
