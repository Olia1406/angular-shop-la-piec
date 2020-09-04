import { Component, OnInit, TemplateRef } from '@angular/core';
import { IDiscount } from 'src/app/shared/interfaces/discount.interface';
import { Discount } from 'src/app/shared/models/discount.model';
import { DiscountService } from 'src/app/shared/services/discount.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { OrderPipe } from 'ngx-order-pipe';

import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, config, of } from 'rxjs';
import { newArray } from '@angular/compiler/src/util';


@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss'],
  providers: []
})
export class AdminDiscountComponent implements OnInit {
  adminDiscount: Array<IDiscount> = [];
  dID = 1;
  dTitle: string;
  dText: string;
  dImage = 'https://www.lapiec-pizza.com.ua/wp-content/uploads/2020/05/aktsiya-dlya-sajta-21.jpg'
  currDiscount: IDiscount;

  editStatus = false;
  uploadProgress: Observable<number>;

  modalRef: BsModalRef;
  modalRefconfig = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  sortedAdminDiscount: Array<IDiscount> = [];
  order: string = 'name';
  reverse: boolean = false;
  searchParam: string;

  constructor(private dService: DiscountService,
    private modalService: BsModalService,
    private afStorage: AngularFireStorage,
    private orderPipe: OrderPipe) {
    this.sortedAdminDiscount = orderPipe.transform(this.adminDiscount, 'name');
  }

  ngOnInit(): void {
    this.getAdminDiscount();
  }
  // private getAdminDiscount(): void {
  // this.dService.getJSONDiscount().subscribe(data => {
  // this.adminDiscount = data;
  // });
  // }

  private getAdminDiscount(): void {
    this.dService.getFireCloudDiscount().subscribe(collection => {
      // console.log(collection);
      this.adminDiscount = collection.map(document => {
        const data = document.payload.doc.data() as IDiscount;
        const id = document.payload.doc.id;
        return { id, ...data };
      })
    })
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.modalRefconfig);
  }
  closeModalCross() {
    this.modalRef.hide();
    this.resetForm();
  }
  addDiscBtn(template: TemplateRef<any>): void {
    this.openModal(template);
    this.editStatus = false;
  }

  addDiscount(): void {
    const newDiscount = new Discount(this.dID, this.dTitle, this.dText, this.dImage);
    if (this.editStatus == true) {
      // this.dService.updateJSONDiscount(newDiscount).subscribe(() => {
      // this.getAdminDiscount();
      // })
      this.dService.updateFireCloudDiscount({ ...newDiscount })
        .then(() => this.getAdminDiscount())
        .catch(error => console.log(error));

      this.editStatus = false;
    }
    else {
      delete newDiscount.id;
      // this.dService.postJSONDiscount(newDiscount).subscribe(() => {
      // this.getAdminDiscount();
      // });
      this.dService.postFireCloudDiscount({ ...newDiscount })
        .then(() => this.getAdminDiscount())
        .catch(error => console.log(error));
    }
    this.modalRef.hide();
    this.resetForm();
  }

  editDiscount(template: TemplateRef<any>, discount: IDiscount): void {
    this.modalRef = this.modalService.show(template, this.modalRefconfig);
    this.dID = discount.id;
    this.dTitle = discount.title;
    this.dText = discount.text;
    this.dImage = discount.image;
    this.editStatus = true;
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const type = file.type.slice(file.type.indexOf('/') + 1);
    const name = file.name.slice(0, file.name.lastIndexOf('.')).toLowerCase();
    const filePath = `images/${name}.${type}`;
    const upload = this.afStorage.upload(filePath, file);
    this.uploadProgress = upload.percentageChanges();
    upload.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.dImage = url;
      });
    });
  }

  deleteDiscount(d: IDiscount, template: TemplateRef<any>) {
    this.openModal(template);
    this.currDiscount = d;
  }
  confirmDeleteDiscount(discount: IDiscount): void {
    discount = this.currDiscount;
    // this.dService.deleteJSONDiscount(discount.id).subscribe(() => {
    // this.getAdminDiscount();
    // });
    this.dService.deleteFireCloudDiscount(discount)
      .then(() => this.getAdminDiscount())
      .catch(error => console.log(error));

    this.modalRef.hide();
    this.afStorage.storage.refFromURL(discount.image).delete();
  }
  decline(): void {
    this.modalRef.hide();
  }

  private resetForm(): void {
    this.dID = 1;
    this.dTitle = '';
    this.dText = '';
    this.dImage = 'https://www.lapiec-pizza.com.ua/wp-content/uploads/2020/05/aktsiya-dlya-sajta-21.jpg';
  }

}
