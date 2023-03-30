import { Assignment } from './assignment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToInputDate } from './../utilities/date-helper'
import { decimalRegex, httpHeaders } from './../utilities/constants'

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  public tableHeadings: any[] = [
    { key: 'assignmentId', text: '#', searchFilter: true },
    { key: 'assignDate', text: 'Assign Date', searchFilter: true },
    { key: 'hours', text: 'Hours', searchFilter: true },
    { key: 'charge', text: 'Charge', searchFilter: true },
    { key: null, text: 'Edit' }
  ];

  public dashboardName: string = 'Assignments'
  public data: Assignment[] = [];
  public idColumn: string = 'assignmentId';
  public interfaceName: string = 'Assignment';
  public error?: string;

  public projects: any[] = []
  public jobs: any[] = []
  public employees: any[] = []

  public selected?: Assignment;
  public formTitle: string = '';
  public form = new FormGroup({
    assignDate: new FormControl(
      '',
      Validators.required,
    ),
    projectId: new FormControl(
      '',
      Validators.required,
    ),
    employeeId: new FormControl(
      '',
      Validators.required,
    ),
    assignJobId: new FormControl(
      '',
      Validators.required,
    ),
    assignHourCharge: new FormControl(
      '',
    ),
    hours: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(decimalRegex)
      ]
    ),
    charge: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(decimalRegex)
      ]
    ),

  }, null, this.isDuplicate());

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadJobs()
    this.loadProjects()
    this.loadEmployees()
  }

  toggleForm(row: any = {}) {
    this.form.reset();
    this.form.patchValue(row!);

    if (row?.assignDate != null) {
      let dateFormat = convertToInputDate(row.assignDate)

      this.form.get('assignDate')?.patchValue(dateFormat);
    }

    let form = document.getElementById('form');
    form!.classList.toggle('hidden')

    return row;
  }

  submitForm() {
    let toast = document.getElementById('toast');

    if (this.form.valid) {
      this.error = undefined
      let assignmentId = this.selected?.assignmentId

      this.selected!.assignDate = new Date(this.form.controls['assignDate'].value!).toISOString()

      this.selected!.projectId = +this.form.controls['projectId'].value!
      this.selected!.employeeId = +this.form.controls['employeeId'].value!
      this.selected!.assignJobId = +this.form.controls['assignJobId'].value!
      this.selected!.assignHourCharge = +this.form.controls['assignHourCharge'].value!
      this.selected!.hours = +this.form.controls['hours'].value!
      this.selected!.charge = +this.form.controls['charge'].value!
      

      if (assignmentId != null) {
        let url = environment.baseUrl + 'api/Assignments/' + assignmentId;

        this.http.put(url, this.selected, {
          headers: httpHeaders
        }).subscribe(result => {
          let index = this.data.findIndex((el: any) => el.assignmentId == assignmentId)
          this.data[index] = this.selected!;

          toast!.classList.remove('opacity-0')

          setTimeout(() => {
            toast!.classList.add('opacity-0')
            this.toggleForm()

          }, 1000)

        }, error => console.error(error))
      } else {
        let url = environment.baseUrl + 'api/Assignments';

        this.http.post(url, this.selected, {
          headers: httpHeaders
        }).subscribe(result => {
          toast!.classList.remove('opacity-0')

          setTimeout(() => {
            toast!.classList.add('opacity-0')
            this.toggleForm()

            document.location.reload()

          }, 1000)
        }, error => console.error(error))
      }
    } else {
      if (this.form.errors) {
        toast!.classList.remove('opacity-0')

        setTimeout(() => {
          toast!.classList.add('opacity-0')

        }, 1000)
      }
    }
  }

  receiveChildData(data: any) {
    this.selected = data

    this.formTitle = data[this.idColumn] == null ? 'New ' + this.interfaceName : 'Edit ' + this.interfaceName
  }

  isDuplicate() {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {
      var assignment = <Assignment>{};

      assignment.assignmentId = (this.selected?.assignmentId) ? this.selected.assignmentId : 0;

      assignment.assignDate = new Date(this.form.controls['assignDate'].value!).toISOString()

      assignment.projectId = +this.form.controls['projectId'].value!
      assignment.employeeId = +this.form.controls['employeeId'].value!
      assignment.assignJobId = +this.form.controls['assignJobId'].value!
      assignment.assignHourCharge = +this.form.controls['assignHourCharge'].value!
      assignment.hours = +this.form.controls['hours'].value!
      assignment.charge = +this.form.controls['charge'].value!

      var url = environment.baseUrl + 'api/Assignments/IsDuplicate';

      return this.http.post<boolean>(url, assignment, {
        headers: httpHeaders
      }).pipe(map(result => {
        if (result) {
          this.error = 'Duplicate Row'
          return { isDuplicate: true }
        } else {
          this.error = undefined
          return null
        }
      }));
    }
  }

  loadProjects() {
    var url = environment.baseUrl + 'api/Projects';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "name");
    this.http.get<any>(url, { params: params, headers: httpHeaders }).subscribe(result => {
      this.projects = result.data;
    }, error => console.error(error));
  }

  loadJobs() {
    var url = environment.baseUrl + 'api/Jobs';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "description");
    this.http.get<any>(url, { params: params, headers: httpHeaders }, ).subscribe(result => {
      this.jobs = result.data;
    }, error => console.error(error));
  }

  loadEmployees() {
    var url = environment.baseUrl + 'api/Employees';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "firstName");
    this.http.get<any>(url, { params: params, headers: httpHeaders }).subscribe(result => {
      this.employees = result.data;
    }, error => console.error(error));
  }

  selectAssociatedHourCharge() {
    let associatedJobId = +this.form.controls['assignJobId'].value!

    let job = this.jobs.find((el: any) => el.jobId == associatedJobId)

    this.form.get('assignHourCharge')?.patchValue(job.hourCharge)
  }
}
