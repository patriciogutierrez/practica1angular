import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
//API URL
const apiUrl = 'http://200.10.22.95:3000';
@Injectable()
export class AuthService {
  currentUser: any;
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {
    
   }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>(apiUrl+'/api/users', { username: username, password: password })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          this.currentUser = username;
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
  public get loggedUser(): String {
    return this.jwtHelper.decodeToken(localStorage.getItem('access_token')).username;
  }
}
