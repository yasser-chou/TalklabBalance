import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";
import {EmployeeService} from "../../services/employee/employee.service";


// Custom validator to check if email is valid
export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(control.value) ? null : { invalidEmail: true };
}

// Custom validator to check if phone number is valid
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const phonePattern = /^\+?[0-9]{10,15}$/;
  return phonePattern.test(control.value) ? null : { invalidPhone: true };
}


@Component({
  selector: 'app-create-employer',
  templateUrl: './create-employer.component.html',
  styleUrls: ['./create-employer.component.css']
})
export class CreateEmployerComponent implements OnInit {

  selectedFile: File | null = null; // Storing the image of the employer, initialized as null
  imagePreview: string | ArrayBuffer | null = null; // Initialized as null
  validateForm!: FormGroup;
  employees: Array<{ email: string; phone: string }> = []; // Store list of employees

  constructor(private fb: FormBuilder,
              private notification: NzNotificationService,
              private router: Router,
              private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email, emailValidator]],
      phone: [null, [Validators.required, phoneValidator]],
      position: [null, [Validators.required]],
      salary: [null, [Validators.required, Validators.min(0)]],
      startDate: [null, [Validators.required]]
    });
  }


  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  isDuplicateEmployee(email: string, phone: string): boolean {
    return this.employees.some(employee => employee.email === email || employee.phone === phone);
  }

  postEmployee() {
    if (this.validateForm.valid && this.selectedFile) {
      const email = this.validateForm.get('email').value;
      const phone = this.validateForm.get('phone').value;
      const startDate = new Date(this.validateForm.get('startDate')?.value).toISOString().split('T')[0];

      // Check for duplicates before submission
      if (this.isDuplicateEmployee(email, phone)) {
        if (this.employees.some(employee => employee.email === email)) {
          this.notification.error('ERROR', 'Email already exists!', {nzDuration: 5000});
        } else if (this.employees.some(employee => employee.phone === phone)) {
          this.notification.error('ERROR', 'Phone number already exists!', {nzDuration: 5000});
        }
      } else {
        // Prepare the form data
        const formData: FormData = new FormData();
        formData.append('img', this.selectedFile);
        formData.append('firstname', this.validateForm.get('firstname').value);
        formData.append('lastname', this.validateForm.get('lastname').value);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('position', this.validateForm.get('position').value);
        formData.append('salary', this.validateForm.get('salary').value);
        formData.append('startDate', startDate);

        // Call the backend service
        this.employeeService.postEmployee(formData).subscribe(
          () => {
            // On success, add employee to the list and show success message
            this.employees.push({email, phone});
            this.notification.success('SUCCESS', 'Employer added successfully', {nzDuration: 5000});
          },
          error => {
            // Log the full error response for debugging
            console.error('Error response:', error);

            // Check for HTTP status 409 (Conflict) and handle it
            if (error.status === 409) {
              this.notification.error('ERROR', 'Email or phone number already exists!', {nzDuration: 5000});
            } else {
              // Generic error message for other statuses
              const errorMessage = error.error?.message || 'An error occurred during the request';
              this.notification.error('ERROR', errorMessage, {nzDuration: 5000});
            }
          }
        );
      }
    } else {
      // Show error if form is invalid
      this.notification.error('ERROR', 'Please fill out all required fields correctly.', {nzDuration: 5000});
    }
  }
}
