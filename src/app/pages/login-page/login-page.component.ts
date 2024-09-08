import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(private readonly authService: AuthService,
    private readonly router: Router
  ) { }
  loginForm = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  })

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      //@ts-ignore
      this.authService.login(this.loginForm.value).subscribe(val => {
        this.router.navigate([''])
      })

    }
  }
}
