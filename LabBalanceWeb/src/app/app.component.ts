import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { UserStorageService } from "./services/storage/storage.service";
import { filter } from "rxjs/operators";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LabBalanceWeb';
  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;
  isClientLoggedIn: boolean = false;
  isModalActive: boolean = false;

  constructor(private router: Router, private userStorageService: UserStorageService) {
    // Listen to route changes to determine if the user is on the register or login page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isRegisterPage = event.urlAfterRedirects === '/register';
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }

  showModal() {
    this.isModalActive = true;
  }

  hideModal() {
    this.isModalActive = false;
  }




  ngOnInit() {

    // Check if the client is logged in on component initialization
    this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();

    // Update the login status on every navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();
    });
  }

  logout() {
    this.userStorageService.signOut();
    this.router.navigateByUrl('/login');
  }
}
