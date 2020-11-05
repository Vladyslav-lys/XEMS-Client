import {Teacher} from './teacher';
import {Student} from './student';
import {Discipline} from './discipline';
import {ReportingBySubjectType} from '../_enums/reportingBySubjectType';

export class ReportingBySubject {
  id: number;
  teacher: Teacher;
  student: Student;
  discipline: Discipline;
  title: string;
  description: string;
  reporting: ReportingBySubjectType;
  dueDate: any;
  realDueDate: any;
  isCompleted: boolean;
  grade: number;
}