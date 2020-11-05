export class operationStatusInfo {
  attachedInfo?: string;
  attachedObject?: any;

  operationStatus: OperationStatus;
}

export enum OperationStatus {
  Done = 0x1,
  Cancelled = 0x2
}
