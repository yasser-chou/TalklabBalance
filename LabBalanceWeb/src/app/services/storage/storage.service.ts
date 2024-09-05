import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN = 's_token';
const USER = 's_user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor(private jwtHelper: JwtHelperService) {}

  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  public getUser(): any {
    const userString = localStorage.getItem(USER);
    return userString ? JSON.parse(userString) : null;
  }

  public getUserId(): string {
    const user = this.getUser();
    return user ? user.userId : '';
  }

  public isClientLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
}
