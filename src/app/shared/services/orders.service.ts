import { Injectable } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { Subject, Observable } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';
import { HttpClient } from '@angular/common/http';
import { DocumentChangeAction, AngularFirestore, DocumentReference } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  basket: Subject<any> = new Subject<any>();
  private url: string;
  constructor(private http: HttpClient, private firecloud: AngularFirestore) {
    this.url = 'http://localhost:3000/orders';
  }

  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.getItem('myOrder')) {
      localProducts = JSON.parse(localStorage.getItem('myOrder'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      }
      else {
        localProducts.push(product);
      }
    }
    else {
      localProducts.push(product);
    }
    localStorage.setItem('myOrder', JSON.stringify(localProducts));
    this.basket.next('Хто щось добавив в кошик');
  }

  addOrder(order: IOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.url, order);
  }

  getOrder(): Observable<Array<IOrder>> {
    return this.http.get<Array<IOrder>>(this.url);
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.url}/${order.id}`, order);
  }

  deleteOrder(order: IOrder): Observable<IOrder> {
    return this.http.delete<IOrder>(`${this.url}/${order.id}`);
  }
  // ------------------------------- firecloud ------------------------------------

  getFireCloudOrder(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firecloud.collection('orders').snapshotChanges();
  }

  postFireCloudOrder(order: IOrder): Promise<DocumentReference> {
    return this.firecloud.collection('orders').add(order);
  }

  updateFireCloudOrder(order: IOrder): Promise<void>{
    return this.firecloud.collection('orders').doc(order.id.toString()).update(order);
  }

  deleteFireCloudOrder(order: IOrder): Promise<void>{
    return this.firecloud.collection('orders').doc(order.id.toString()).delete();
  }
}
