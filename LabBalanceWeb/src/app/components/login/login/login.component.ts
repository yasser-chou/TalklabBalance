import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AuthService} from "../../../services/auth/auth.service";
import {UserStorageService} from "../../../services/storage/storage.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router,
    private userStorageService:UserStorageService

  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form Values:', this.validateForm.value);
      this.authService.login(
        this.validateForm.get('userName')!.value,
        this.validateForm.get('password')!.value
      ).subscribe({
        next: (res) => {
          console.log(res);
          this.handleLoginSuccess();
        },
        error: (error) => {
          console.log(error);
          this.notification.error('ERROR', 'Bad credentials', { nzDuration: 5000 });
        }
      });
    } else {
      this.notification.error('ERROR', 'Invalid form', { nzDuration: 5000 });
    }
  }

  private handleLoginSuccess(): void {
    if (this.userStorageService.isClientLoggedIn()) {
      this.router.navigateByUrl('/dashboard').catch(err => console.error('Failed to navigate:', err));
    }
  }


}
