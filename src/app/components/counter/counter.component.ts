import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  @Input() product: IProduct;
  @Output() changeCount = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  productCount(status: boolean): void {
    if (status) {
      this.product.count++;
    }
    else {
      if (this.product.count > 1) {
        this.product.count--;
      }
    }
    this.changeCount.emit(true);
  }

}
