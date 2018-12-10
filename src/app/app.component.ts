import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    if(!this.auth.loggedIn) this.logout();
  }
  title = 'monitoreo-mapa';
  public currentUser: any;
  constructor(public auth: AuthService, private router: Router) {
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }



}
