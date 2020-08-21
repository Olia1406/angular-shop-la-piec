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
    this.dService.getJSONDiscount().subscribe(data => {
      this.userDiscount = data;
    });
  }

}
