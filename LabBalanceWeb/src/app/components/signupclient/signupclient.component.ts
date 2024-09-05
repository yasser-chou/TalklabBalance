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


  submitForm() {
    this.authService.registerClient(this.validateForm.value).subscribe(res=>
    {
        this.notification
          .success('SUCCESS',
            'Sign up succefully',
            {nzDuration:5000});
        this.router.navigateByUrl('/login')

    },error => {
      this.notification
        .error('ERROR',
          `${error.error}`,
          {nzDuration:5000});

    });
  }


}
