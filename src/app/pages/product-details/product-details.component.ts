import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../shared/services/orders.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  constructor(private prodService: ProductService,
              private ordersService: OrdersService,
              private actRoute: ActivatedRoute,
              private firecloud: AngularFirestore) { }

  ngOnInit(): void {
    this.getViewProduct();
  }

  // private getViewProduct(): void {
    // const id = +this.actRoute.snapshot.paramMap.get('id');
    // this.prodService.getOneProduct(id).subscribe(data => {
      // this.product = data;
      // console.log(this.product);
    // });
  // }

  private getViewProduct(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.firecloud.collection('products').doc(id).get().subscribe(
      document => {
        const data = document.data();
        const dataID = document.id;
        this.product = { dataID, ...data };
      }
    );
  }

  addToBasket(product: IProduct): void {
    this.ordersService.addBasket(product);
    product.count = 1;
  }

}
