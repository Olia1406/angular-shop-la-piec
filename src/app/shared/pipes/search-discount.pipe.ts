import { Pipe, PipeTransform } from '@angular/core';
import { IDiscount } from '../interfaces/discount.interface';

@Pipe({
  name: 'searchDiscount',
  pure: false
})

export class SearchDiscountPipe implements PipeTransform {
  transform(value: Array<IDiscount>, seacrhParam: string): Array<IDiscount> {
    if (!seacrhParam) {
      return value;
    }
    if (!value) {
      return null;
    }
    return value.filter(discount => discount.title.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.text.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.id.toString().includes(seacrhParam)
    );
  }


}
