import { Injectable } from '@angular/core';
import { IDiscount } from '../interfaces/discount.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentChangeAction, AngularFirestore, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private url: string;
  constructor(private http: HttpClient,
    private firecloud: AngularFirestore) {
    this.url = 'http://localhost:3000/discounts';
  }

  getJSONDiscount(): Observable<Array<IDiscount>> {
    return this.http.get<Array<IDiscount>>(this.url);
  }

  postJSONDiscount(discount: IDiscount): Observable<IDiscount> {
    return this.http.post<IDiscount>(this.url, discount);
  }

  deleteJSONDiscount(id: number): Observable<IDiscount> {
    return this.http.delete<IDiscount>(`${this.url}/${id}`);
  }

  updateJSONDiscount(discount: IDiscount): Observable<IDiscount> {
    return this.http.put<IDiscount>(`${this.url}/${discount.id}`, discount);
  }

  // ------------------------------- firecloud ------------------------------------

  getFireCloudDiscount(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firecloud.collection('discounts').snapshotChanges();
  }

  postFireCloudDiscount(discount: IDiscount): Promise<DocumentReference> {
    return this.firecloud.collection('discounts').add(discount);
  }

  updateFireCloudDiscount(discount: IDiscount): Promise<void> {
    return this.firecloud.collection('discounts').doc(discount.id.toString()).update(discount);
  }

  deleteFireCloudDiscount(discount: IDiscount): Promise<void> {
    return this.firecloud.collection('discounts').doc(discount.id.toString()).delete();
  }

}