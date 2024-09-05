import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {UserStorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userStorageService: UserStorageService) {}

  canActivate(): boolean {
    if (this.userStorageService.isClientLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
