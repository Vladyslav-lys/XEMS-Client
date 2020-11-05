import { MasterDetailComponent } from './master-detail.component';

export class DetailViewController {
  constructor(private masterDetail: MasterDetailComponent) { }

  canClose(): Promise<boolean> | boolean {
    return true;
  }

  onOpen(): Promise<void> | void {
  }

  close(): void {
    this.masterDetail.close();
  }
}
