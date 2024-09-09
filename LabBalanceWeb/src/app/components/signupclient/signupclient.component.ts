import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-signupclient',
  templateUrl: './signupclient.component.html',
  styleUrls: ['./signupclient.component.css']
})
export class SignupClientComponent implements OnInit {
  validateForm!: FormGroup;
  formSubmitted = false;
  selectedFile: File | null = null; // To store the selected profile picture

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification:NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      phone: [null],
      password: [null, [Validators.required, Validators.minLength(8)]],
      checkPassword:[null,[Validators.required, Validators.minLength(8)]]
    });
  }

// Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Submit the registration form along with the profile picture
  submitForm(): void {
    const signupRequestDTO = {
      username: this.validateForm.get('username')?.value,
      firstname: this.validateForm.get('firstname')?.value,
      lastname: this.validateForm.get('lastname')?.value,
      phone: this.validateForm.get('phone')?.value,
      password: this.validateForm.get('password')?.value
    };

    // Pass both the signupRequestDTO and the selected file to the service
    this.authService.registerClient(signupRequestDTO, this.selectedFile).subscribe(
      (res) => {
        this.notification.success('SUCCESS', 'Sign up successfully', { nzDuration: 5000 });
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.notification.error('ERROR', `${error.error}`, { nzDuration: 5000 });
      }
    );
  }



}
