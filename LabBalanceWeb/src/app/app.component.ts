import {Component, OnInit, OnDestroy} from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { UserStorageService } from "./services/storage/storage.service";
import { filter } from "rxjs/operators";
import { AuthService } from "./services/auth/auth.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {HttpClient, HttpHeaders} from '@angular/common/http';


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
  imageUrl: SafeUrl | null = null;  // Safe URL for the profile image


  constructor(private router: Router,
              private userStorageService: UserStorageService,
              private authService: AuthService,
              private sanitizer: DomSanitizer,
              private http: HttpClient) {  // Use HttpClient instead of Http

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
      console.log('User details from localStorage:', this.user);

      this.loadUserProfileImage();  // Load user profile image after retrieving user details
    }

    // Update the login status and user details on every navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();
      if (this.isClientLoggedIn) {
        const newUser = this.userStorageService.getUser();  // Get the updated user details
        if (this.user?.userId !== newUser?.userId) {  // Check if the user has changed
          this.user = newUser;  // Update user
          this.loadUserProfileImage();  // Reload profile image if the user has changed
        }
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

  // Load the user's profile image from the backend
  loadUserProfileImage() {
    const token = this.userStorageService.getToken();  // Get the JWT token from storage
    const user = this.userStorageService.getUser();    // Get the current user

    if (!token || !user) {
      console.warn('No token or user found. User may not be authenticated.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
    });

    // Force the image URL to refresh by adding a timestamp to the URL to prevent caching
    const timestamp = new Date().getTime();
    this.http.get(`http://localhost:8080/user/profile-image?ts=${timestamp}`, { headers: headers, responseType: 'blob' })
      .subscribe(blob => {
        const objectURL = window.URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);  // Sanitize and assign the new image URL
      }, error => {
        console.warn('Failed to load profile image:', error);
      });
  }


}
