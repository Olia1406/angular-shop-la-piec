import { Component, OnInit } from '@angular/core';
import { IDiscount } from 'src/app/shared/interfaces/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  userDiscount: Array<IDiscount> = [];
  constructor(private dService: DiscountService) { }

  ngOnInit(): void {
    this.getUserDiscount();
  }

  getUserDiscount(): void {
    // this.dService.getJSONDiscount().subscribe(data => {
    // this.userDiscount = data;
    // });
    this.dService.getFireCloudDiscount().subscribe(data => {
      this.userDiscount = data.map(document => {
        const data = document.payload.doc.data() as IDiscount;
        const id = document.payload.doc.id;
        return { id, ...data };
      })
    })
  }

}
