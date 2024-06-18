import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserInfo } from '../user-info';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loguearse() {
    if (this.formGroup.valid) {
      let userInfo: IUserInfo = Object.assign({}, this.formGroup.value);
      this.accountService.login(userInfo).subscribe({
        next: (token) => this.recibirToken(token),
        error: (error) => this.manejarError(error)
      });
    } else {
      alert('Formulario no válido. Por favor, revisa los campos.');
    }
  }

  registrarse() {
    if (this.formGroup.valid) {
      let userInfo: IUserInfo = Object.assign({}, this.formGroup.value);
      this.accountService.create(userInfo).subscribe({
        next: (token) => this.recibirToken(token),
        error: (error) => this.manejarError(error)
      });
    } else {
      alert('Formulario no válido. Por favor, revisa los campos.');
    }
  }

  recibirToken(token: { token: string; expiration: string; }) {
    localStorage.setItem('token', token.token);
    localStorage.setItem('tokenExpiration', token.expiration);
    this.router.navigate([""]);
  }

  manejarError(error: any) {
    if (error && error.error) {
      const errorMessage = error.error.message || 'Error al procesar la solicitud.';
      alert(errorMessage);
    } else {
      alert('Error desconocido.');
    }
  }
}
