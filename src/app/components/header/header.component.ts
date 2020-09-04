import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { OrdersService } from '../../shared/services/orders.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  totalPrice = 0;
  modalRef: BsModalRef;
  private basket: Array<IProduct> = [];
  switch: boolean;
  userEmail: string;
  userPassword: string;
  firstName: string;
  lastName: string;
  // enter: boolean;
  // adm: boolean;
  loginStatus: boolean;
  loginUrl: string;
  loginName: string;

  constructor(private ordersService: OrdersService,
             private modalService: BsModalService,
             private authService: AuthService) { }

  ngOnInit(): void {
    this.checkBasket();
    this.getLocalProducts();
    this.checkLogin();
    this.updateCheckLogin();
  }

  private checkBasket(): void {
    this.ordersService.basket.subscribe(() => {
      this.getLocalProducts();
    });
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('myOrder')) {
      this.basket = JSON.parse(localStorage.getItem('myOrder'));
      this.totalPrice = this.basket.reduce((total, prod) => {
        return total + (prod.price * prod.count);
      }, 0);
    }
    else {
      this.totalPrice = 0;
    }
  }

  loginModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  switchForm(): void {
    this.switch = !this.switch;
  }
  loginUser(): void {
    this.authService.login(this.userEmail, this.userPassword);
    this.resetForm();
    // this.enter = true;
    // this.userEmail == 'admin@gmail.com' ? this.adm = true : this.adm = false;
    this.modalRef.hide();
  }
  registerUser(): void {
    this.authService.signUp(this.userEmail, this.userPassword, this.firstName, this.lastName);
    this.resetForm();
    this.switch = !this.switch;
    this.modalRef.hide();
  }
  private resetForm(): void {
    this.userEmail = '';
    this.userPassword = '';
    this.firstName = '';
    this.lastName = '';
  }
  
  private updateCheckLogin(): void {
    this.authService.userStatusChanges.subscribe(
      () => {
        this.checkLogin();
      }
    );
  }

  private checkLogin(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin != null && admin.role === 'admin' && admin.access) {
      this.loginStatus = true;
      this.loginName = 'адмін';
      this.loginUrl = 'admin';
    }
    else if (user != null && user.role === 'user') {
      this.loginStatus = true;
      this.loginName = 'кабінет';
      this.loginUrl = 'profile';
    }
    else {
      this.loginStatus = false;
      this.loginName = '';
      this.loginUrl = '';
    }
  }






}
