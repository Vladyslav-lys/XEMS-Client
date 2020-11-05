import { Directive, Input, ViewContainerRef } from '@angular/core';
import { DetailView } from './detail-view';
import { DetailViewController } from './detail-view-controller';

@Directive({
  selector: '[detailViewController]'
})
export class DetailViewControllerDirective {
  constructor(private view: ViewContainerRef) { }

  @Input('detailViewController') set controller(ctrl: DetailViewController) {
    const host = this.view['_data'].componentView.component as DetailView;
    if (host.canClose) {
      ctrl.canClose = host.canClose.bind(host);
    }
    if (host.onOpen) {
      ctrl.onOpen = host.onOpen.bind(host);
    }
  }
}

// see https://github.com/angular/angular/issues/8277 about host injection issue when type is unknown