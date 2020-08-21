import { Component, OnInit, TemplateRef } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrdersService } from '../../shared/services/orders.service';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})

export class AdminOrderComponent implements OnInit {
  adminOrders: Array<IOrder> = [];
  modalRef: BsModalRef;

  totalPrice = 0;
  count = 1;
  currAdmOrder: IOrder;
  statusOption: string;

  constructor(private ordersService: OrdersService,
    private prodService: ProductService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getOrders();
  }
  private getOrders(): void {
    this.ordersService.getOrder().subscribe(
      data => {
        this.adminOrders = data;
        this.adminOrders.sort(function (a, b) {
          return Date.parse(b.dateOrder.toString()) - Date.parse(a.dateOrder.toString());
        })
      }
    );
  }
  openDetailsModal(template: TemplateRef<any>, order: IOrder): void {
    this.currAdmOrder = order;
    this.statusOption = 'В обробці';
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
    this.getTotal();
  }

  private getTotal(): void {
    this.totalPrice = this.currAdmOrder.productOrder.reduce((total, prod) => total + (prod.price * prod.count), 0);
  }

  changeStatus(): void {
    this.currAdmOrder.statusOrder = this.statusOption;
    this.ordersService.updateOrder(this.currAdmOrder)
      .subscribe(() => {
        this.getOrders();
      })
  }

  deleteUserOrder(order: IOrder): void {
    if (order.statusOrder == 'Виконано' || order.statusOrder == 'Скасовано') {
      this.ordersService.deleteOrder(order).subscribe(() => {
        this.getOrders();
      })
    }
  }


}

