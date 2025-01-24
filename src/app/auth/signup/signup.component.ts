import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { last } from 'rxjs';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { mismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: [passwordMatchValidator] }
    ),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
      state: new FormControl('', {
        validators: [Validators.required],
      }),
      zip: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required],
    }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, {
      validators: [Validators.requiredTrue],
    }),
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

  get emailIsValid() {
    return (
      this.form.touched &&
      this.form.controls.email.invalid &&
      this.form.controls.email.dirty
    );
  }

  get passwordIsValid() {
    return (
      this.form.touched &&
      this.form.get('password')?.invalid &&
      this.form.get('password')?.dirty
    );
  }

  get passwordsGroup() {
    return this.form.get('passwords') as FormGroup;
  }

  get confirmPasswordIsValid() {
    const confirmPasswordControl = this.passwordsGroup.get('confirmPassword');
    const mismatch = this.passwordsGroup.errors?.['mismatch'];
    return (
      confirmPasswordControl?.touched &&
      (confirmPasswordControl?.invalid || mismatch)
    );
  }
}
