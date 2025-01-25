import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from './passwordMatchValidator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    passwords: new FormGroup(
      {
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      },
      { validators: passwordMatchValidator }
    ),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    address: new FormGroup({
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', [Validators.required]),
    source: new FormArray([new FormControl(false), new FormControl(false), new FormControl(false)]),
    terms: new FormControl(false, [Validators.requiredTrue]),
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onReset() {
    this.form.reset();
  }

  // Helper to check if a control is valid
  isControlInvalid(controlName: string, groupName: string | null = null): boolean {
    const control = groupName
      ? (this.form.get(groupName) as FormGroup)?.get(controlName)
      : this.form.get(controlName);
    return control?.touched && control?.invalid && control?.dirty || false;
  }

  get passwordsGroup() {
    return this.form.get('passwords') as FormGroup;
  }

  get confirmPasswordIsValid() {
    const confirmPasswordControl = this.passwordsGroup.get('confirmPassword');
    const mismatch = this.passwordsGroup.errors?.['mismatch'];

    return (
      confirmPasswordControl?.touched &&
      confirmPasswordControl?.dirty &&
      (confirmPasswordControl?.invalid || mismatch)
    );
  }
}
