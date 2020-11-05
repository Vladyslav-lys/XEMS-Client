import {Student} from './student';
import {Discipline} from './discipline';
import { CourseTask } from "../_enums/courseTask";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { Semester } from "../_enums/semester";

export class Subject {
  id: number;
  student: Student;
  discipline: Discipline;
  year: number;
  semester: Semester;
  lectureHours: number;
  practiceHours: number;
  laboratoryHours: number;
  reporting: ReportingBySemesterType;
  courseTask: CourseTask;
  semesterGrade: number;
}