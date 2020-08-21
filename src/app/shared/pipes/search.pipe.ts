import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';


@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(value: Array<ICategory>, seacrhParam: string): Array<ICategory> {
    if (!seacrhParam) {
      return value;
    }
    if (!value) {
      return null;
    }
    return value.filter(category => category.nameEN.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      category.nameUA.toLowerCase().includes(seacrhParam.toLowerCase()) ||
      category.id.toString().includes(seacrhParam)
    );

  }
}