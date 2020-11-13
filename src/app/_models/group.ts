import {Teacher} from './teacher';
import { Degree } from "../_enums/degree";

export class Group {
  id: number;
  name: string;
  curator: Teacher;
  learningStartDate: any;
  learningEndDate: any;
  qualificationLevel: Degree;
}