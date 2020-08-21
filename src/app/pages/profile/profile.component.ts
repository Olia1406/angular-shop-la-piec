import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email: string;
  firstName: string;
  lastName: string;
  // usORadm:boolean;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.getUserData();
  }
  private getUserData(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.email = user.userEmail;
    this.firstName = user.userFirstName;
    this.lastName = user.userLastName;
  }

  signOut(): void {
    this.authService.SignOut();
  }

  // signOut(userORadm:boolean): void {
    // this.authService.SignOut();
    // this.usORadm = userORadm;
}