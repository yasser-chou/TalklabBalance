import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-password-prompt',
  templateUrl: './password-prompt.component.html',
  styleUrls: ['./password-prompt.component.css']
})
export class PasswordPromptComponent {
  accessCode: string = '';

  @Output() codeEntered = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<void>();

  submit() {
    this.codeEntered.emit(this.accessCode);
  }

  cancel() {
    this.canceled.emit();
  }
}
