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

  registerClient(signupRequestDTO: any, file: File): Observable<any> {
    const formData = new FormData();

    // Append fields from signupRequestDTO to formData
    formData.append('username', signupRequestDTO.username);
    formData.append('firstname', signupRequestDTO.firstname);
    formData.append('lastname', signupRequestDTO.lastname);
    formData.append('phone', signupRequestDTO.phone);
    formData.append('password', signupRequestDTO.password);

    // Append the file to formData if it exists
    if (file) {
      formData.append('file', file);
    }

    // Send the FormData as the body of the POST request
    return this.http.post(BASIC_URL + 'client/sign-up', formData);
  }


  login(username: string, password: string): Observable<HttpResponse<any>> {
    return this.http.post(BASIC_URL + 'authenticate', { username, password }, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<any>) => {
          console.log('Full login response:', res.body);  // Debugging: Check the entire backend response

          const token = res.body.token;
          const userId = res.body.userId;
          const firstname = res.body.firstname;
          const lastname = res.body.lastname;
          const profilePicture = res.body.profilePicture;

          // Ensure token and user details are present before saving
          if (token) {
            this.userStorageService.saveToken(token);  // Save the token
          } else {
            console.error('Token not found in the response body');
          }

          if (userId && firstname && lastname) {
            // Save user details to localStorage
            const userDetails = {
              userId: userId,
              firstname: firstname,
              lastname: lastname,
              profilePicture: profilePicture || null  // Use null if profile picture is not available
            };
            this.userStorageService.saveUser(userDetails);  // Save the user details
            console.log('User details saved to localStorage:', userDetails);  // Debugging
          } else {
            console.error('User details not found in the response body');
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
