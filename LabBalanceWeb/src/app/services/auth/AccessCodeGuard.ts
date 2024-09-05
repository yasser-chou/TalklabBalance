import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { MatDialog } from '@angular/material/dialog';
import { PasswordPromptComponent } from '../../components/password-prompt/password-prompt.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessCodeGuard implements CanActivate {

  private readonly hashedAccessCode = '6c8603295d72545398befa6a32371b0c09909342ec981b8f22cfb4505bae7762'; // SHA-256 hash code

  constructor(private router: Router, private dialog: MatDialog) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.dialog.open(PasswordPromptComponent);

      dialogRef.componentInstance.codeEntered.subscribe((code: string) => {
        const hashedInput = CryptoJS.SHA256(code).toString(); // Use SHA-256 instead of MD5
        if (hashedInput === this.hashedAccessCode) {
          dialogRef.close(true);
          resolve(true); // Allow access
        } else {
          alert('Wrong password. Please contact an administrator if you need access.');
          dialogRef.close(false);
          this.router.navigate(['/login']); // Redirect to login page
          resolve(false); // Deny access
        }
      });

      dialogRef.componentInstance.canceled.subscribe(() => {
        dialogRef.close(false);
        this.router.navigate(['/login']);
        resolve(false); // Deny access
      });
    });
  }
}
