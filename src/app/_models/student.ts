import {Group} from './group';
import {Authorization} from './authorization';

export class Student {
  id: number;
  authorization: Authorization;
  group: Group;
  firstName: string;
  lastName: string;
  birthday: any;
  phone: any;
  address: string;
  createTime: any;
  modifyTime: any;
}