import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { OrdersService } from '../../shared/services/orders.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Array<any> = [];
  category: string;
  constructor(private prodService: ProductService,
    private actRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
    private firecloud: AngularFirestore) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.actRoute.snapshot.paramMap.get('category');
        // this.getProducts(categoryName);
        this.getFireCloudProducts(categoryName);
      }
    });
  }

  ngOnInit(): void {
  }

  // private getProducts(categoryName: string = 'pizza'): void {
    // this.prodService.getCategoryProduct(categoryName).subscribe(data => {
      // this.products = data;
      // this.category = this.products[0].category.nameUA;
    // });
  // }

  private getFireCloudProducts(categoryName: string = 'pizza'): void {
    this.products = [];
    this.firecloud.collection('products').ref.where('category.nameEN', '==', categoryName).onSnapshot(
      collection => {
        collection.forEach(document => {
          const data = document.data();
          const id = document.id;
          this.products.push({ id, ...data });
        });
        this.category = this.products[0].category.nameUA;
      }
    );
  }

  addToBasket(product: IProduct): void {
    this.ordersService.addBasket(product);
    product.count = 1;
  }

}
