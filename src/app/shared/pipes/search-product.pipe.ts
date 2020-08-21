import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'searchProduct'
})
export class SearchProductPipe implements PipeTransform {
  transform(value: Array<IProduct>, seacrhParam: string): Array<any> {
    if (!seacrhParam) {
      return value;
    }
    if (!value) {
      return null;
    }
    return value.filter(discount => discount.id.toString().includes(seacrhParam) ||
      discount.nameEN.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.nameUA.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.description.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.weight.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      discount.price.toString().includes(seacrhParam)
    );
  }

}
