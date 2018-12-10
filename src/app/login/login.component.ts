import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(private auth: AuthService, private router: Router) {
    if (auth.loggedIn) {
      this.router.navigate(['grafico']);
    }
  }

  public submit() {
    //Iniciar sesion, si existe usuario, ingresa al sistema
    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        result => {
          this.router.navigate(['grafico'])
        },
        err => {
          this.error = 'Usuario/Contraseña incoorecto'
          this.username = "";
          this.password = "";
        }
      );
  }

}
