import { Input } from '@angular/core';

export interface DetailView {
  canClose(): Promise<boolean> | boolean;
  onOpen(): Promise<void> | void;
}
