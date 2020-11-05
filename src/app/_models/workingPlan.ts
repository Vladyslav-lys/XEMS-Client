import {Teacher} from './teacher';
import {Discipline} from './discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";

export class WorkingPlan {
  id: number;
  teacher: Teacher;
  discipline: Discipline;
  hours: number;
  role: TeachersRole;
  year: number;
  semester: Semester;
}