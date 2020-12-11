import {Subject} from './subject';
import {ReportingBySubject} from './reportingBySubject';

export class ReportingPlanByModules {
  subject: Subject;
  reportingBySubject: ReportingBySubject;
  realDueDate: any;
  isCompleted: boolean;
  grade: number;
}