import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';
import { OrdersService } from '../../shared/services/orders.service';
import { NgForm } from '@angular/forms';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  orders: Array<IProduct> = [];
  orderID = 1;
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  userComments: string = '';
  totalPrice = 0;
  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getBasket();
  }

  private getBasket(): void {
    if (localStorage.getItem('myOrder')){
      this.orders = JSON.parse(localStorage.getItem('myOrder'));
      this.getTotal();
    }
  }

  private getTotal(): void {
    this.totalPrice = this.orders.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }

  private updateBasket(): void {
    localStorage.setItem('myOrder', JSON.stringify(this.orders));
    this.getTotal();
    this.ordersService.basket.next('віфвіф');
  }

  detectChangeCount(status: boolean): void {
    if (status){
      this.updateBasket();
    }
  }

  deleteProduct(product: IProduct): void {
    if (confirm('Are you sure')){
      const index = this.orders.findIndex(prod => prod.id === product.id);
      this.orders.splice(index, 1);
      this.updateBasket();
    }
  }

  addOrder(): void {
    const order = new Order(this.orderID,
                            this.userName,
                            this.userPhone,
                            this.userCity,
                            this.userStreet,
                            this.userHouse,
                            this.userComments,
                            this.totalPrice,
                            this.orders,
                            new Date())
                            // new Date().getTime())
                            // new Date().toLocaleDateString())
    delete order.id;
    // this.ordersService.addOrder(order).subscribe(
      // () => {
        // this.resetOrder();
      // }
    // );
    this.ordersService.postFireCloudOrder({...order})
    .then(() => this.resetOrder())
    .catch(err => console.log(err));
  }

  resetOrder(): void{
    localStorage.removeItem('myOrder');
    this.orders = [];
    this.ordersService.basket.next('Оформили замовлення');
  }

}
