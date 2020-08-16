export class operationStatusInfo {
  attachedInfo?: string;
  attachedObject?: any;

  operationStatus: operationStatus;
}

export enum operationStatus {
  Done = 0x1,
  Cancelled = 0x2
}
