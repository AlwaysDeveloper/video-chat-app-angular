import { Injectable } from '@angular/core';
import * as fontSolidFree from '@fortawesome/free-solid-svg-icons';
import * as fontRegularFree from '@fortawesome/free-regular-svg-icons';
import * as fontBrandsFree from '@fortawesome/free-brands-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class Fontawesome6Service {

  constructor() { }

  // tslint:disable-next-line:typedef
  getFontSolid(icon){
     return fontSolidFree[icon];
  }

  // tslint:disable-next-line:typedef
  getFontRegular(icon){
    return fontRegularFree[icon];
  }

  // tslint:disable-next-line:typedef
  getFontBrands(icon){
    return fontBrandsFree[icon];
  }

}
