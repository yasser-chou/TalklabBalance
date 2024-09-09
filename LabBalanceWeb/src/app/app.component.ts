import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { UserStorageService } from "./services/storage/storage.service";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'LabBalanceWeb';
  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;
  isClientLoggedIn: boolean = false;
  isModalActive: boolean = false;
  isDropdownOpen: boolean = false;
  user: any;  // To hold the user details like profile picture and name

  constructor(private router: Router, private userStorageService: UserStorageService) {
    // Listen to route changes to determine if the user is on the register or login page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isRegisterPage = event.urlAfterRedirects === '/register';
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }

  ngOnInit() {
    // Check if the client is logged in on component initialization
    this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();

    if (this.isClientLoggedIn) {
      this.user = this.userStorageService.getUser();  // Get the user details like profile picture and name
      console.log('User details from localStorage:', this.user);  // Debugging: check what user object is fetched
    }

    // Update the login status on every navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();
      if (this.isClientLoggedIn) {
        this.user = this.userStorageService.getUser();  // Refresh user details on navigation
      }
    });

    // Add event listener to detect clicks outside the dropdown to close it
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy() {
    // Remove the event listener when the component is destroyed
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;  // Toggle dropdown visibility
  }

  // Close the dropdown when clicking outside of it
  onClickOutside(event: Event) {
    if (!document.querySelector('.user-profile')?.contains(event.target as Node)) {
      this.isDropdownOpen = false;  // Close the dropdown if clicked outside
    }
  }

  // Navigate to settings page
  goToSettings() {
    this.router.navigate(['/settings']);
  }

  // Log out the user
  logout() {
    this.userStorageService.signOut();
    this.router.navigateByUrl('/login');
  }

  // Show modal (if needed for additional functionality)
  showModal() {
    this.isModalActive = true;
  }

  // Hide modal (if needed for additional functionality)
  hideModal() {
    this.isModalActive = false;
  }
}
