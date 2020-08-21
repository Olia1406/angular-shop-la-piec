import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  constructor(private prodService: ProductService,
              private ordersService: OrdersService,
              private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getViewProduct();
  }

  private getViewProduct(): void {
    const id = +this.actRoute.snapshot.paramMap.get('id');
    this.prodService.getOneProduct(id).subscribe(data => {
      this.product = data;
      console.log(this.product);
    });
  }

  addToBasket(product: IProduct): void {
    this.ordersService.addBasket(product);
    product.count = 1;
  }

}
