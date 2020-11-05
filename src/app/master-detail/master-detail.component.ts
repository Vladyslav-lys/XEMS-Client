import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ContentChild,
  TemplateRef,
  EmbeddedViewRef
} from '@angular/core';
import { DetailViewDirective } from './detail-view.directive';
import { DetailViewController } from './detail-view-controller';
import { promiseProps } from './promisify';
import { animate } from './animation';

@Component({
  selector: 'app-master-detail',
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss']
})
export class MasterDetailComponent {
  @ViewChild('detailView', { read: ViewContainerRef, static: false }) detailViewContainer: ViewContainerRef;

  @ContentChild(DetailViewDirective, { static: false }) detailViewDirective: DetailViewDirective;

  @Input() loaderMinDuration = 500;

  detailValue: any;

  @Output() detailChange = new EventEmitter<any>();

  @Input() get detail(): any {
    return this.detailValue;
  }
  set detail(detail: any) {
    this.open(detail);
  }

  _displayDetail = false;
  _displayLoader = false;

  private opening = false;
  private context = new DetailViewController(this);

  constructor(private cd: ChangeDetectorRef) { this._displayDetail = true; }

  open<T extends object>(data: T): void {
    if (this.opening || ! data) return;

    const canCloseFn = this.context.canClose;
    Promise.resolve(canCloseFn()).then(canClose => {
      this.opening = canClose;
      if (!canClose) return;

      this.detailValue = data;
      this.detailChange.emit(this.detailValue);

      if (!this._displayDetail) {
        //this._displayDetail = true;
        this.cd.detectChanges(); // needed to receive detailViewContainer
      }
      const stopAnimation = animate(
        () => this._displayLoader = true, // executed at animation start
        this.loaderMinDuration
      );

      promiseProps(data).then(resolvedData => {
        this.createDetailView(resolvedData);
        this.cd.detectChanges();
        const onOpenFn = this.context.onOpen;
        Promise.resolve(onOpenFn()).then(stopAnimation).then(() => {
          this._displayLoader = false;
          this.opening = false;
        });
      })
    });
  }

  close(): void {
    const canClose = this.context.canClose;
    Promise.resolve(canClose()).then(close => {
      if (close) {
        this.closeDetail();
        this._displayDetail = false;
        this._displayLoader = false;
        this.detailValue = null;
        this.detailChange.emit(null);
      }
    });
  }

  private closeDetail(): void {
    this.detailViewContainer && this.detailViewContainer.clear();
  }

  private createDetailView<T>(data: T): void {
    this.closeDetail();

    this.detailViewContainer.createEmbeddedView(
      this.detailViewDirective.template, {
        $implicit: data,
        controller: this.context
      }
    );
  }
}
