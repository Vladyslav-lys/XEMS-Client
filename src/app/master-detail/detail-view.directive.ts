import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appDetailView]'
})
export class DetailViewDirective {
  constructor(public template: TemplateRef<any>) {}
}
