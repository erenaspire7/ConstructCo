import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { convertToInputDate } from './../utilities/date-helper'
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { numberRegex } from './../utilities/constants'



@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  public tableHeadings: any[] = [
    { key: 'employeeId', text: '#', searchFilter: true },
    { key: 'firstName', text: 'First Name', searchFilter: true },
    { key: 'lastName', text: 'Last Name', searchFilter: true },
    { key: 'initials', text: 'Initials', searchFilter: true },
    { key: 'hireDate', text: 'Hire Date', searchFilter: true },
    { key: 'yearsOfService', text: 'Years Of Service', searchFilter: true },
    { key: null, text: 'Edit' }
  ];

  public dashboardName: string = 'Employees'
  public data: Employee[] = [];
  public idColumn: string = 'employeeId';
  public interfaceName: string = 'Employee';
  public error?: string;

  public jobs: any[] = []

  public selected?: Employee;
  public formTitle: string = '';
  public form = new FormGroup({
    lastName: new FormControl(
      '',
      Validators.required,
    ),
    firstName: new FormControl(
      '',
      Validators.required,
    ),
    initials: new FormControl(
      '',
      Validators.required
    ),
    hireDate: new FormControl(
      '',
      Validators.required
    ),
    jobId: new FormControl(
      '',
      Validators.required
    ),
    yearsOfService: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(numberRegex)
      ]
      
    ),
  }, null, this.isDuplicate());

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadJobs()
  }


  toggleForm(row: any = {}) {
    this.form.reset();
    this.form.patchValue(row!);

    if (row?.hireDate != null) {
      let dateFormat = convertToInputDate(row.hireDate)

      this.form.get('hireDate')?.patchValue(dateFormat);
    }

    let form = document.getElementById('form');
    form!.classList.toggle('hidden')

    return row;
  }

  submitForm() {
    let toast = document.getElementById('toast');

    if (this.form.valid) {
      this.error = undefined
      let employeeId = this.selected?.employeeId

      this.selected!.firstName = this.form.controls['firstName'].value
      this.selected!.lastName = this.form.controls['lastName'].value
      this.selected!.initials = this.form.controls['initials'].value
      this.selected!.jobId = +this.form.controls['jobId'].value
      this.selected!.yearsOfService = +this.form.controls['yearsOfService'].value
      this.selected!.hireDate = new Date(this.form.controls['hireDate'].value).toISOString()


      if (employeeId != null) {
        let url = environment.baseUrl + 'api/Employees/' + employeeId;

        this.http.put(url, this.selected).subscribe(result => {
          let index = this.data.findIndex((el: any) => el.employeeId == employeeId)
          this.data[index] = this.selected!;

          toast!.classList.remove('opacity-0')

          setTimeout(() => {
            toast!.classList.add('opacity-0')
            this.toggleForm()

          }, 1000)

        }, error => console.error(error))
      } else {
        let url = environment.baseUrl + 'api/Employees';

        this.http.post(url, this.selected).subscribe(result => {
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

  loadJobs() {
    var url = environment.baseUrl + 'api/Jobs';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "description");
    this.http.get<any>(url, { params }).subscribe(result => {
      this.jobs = result.data;
    }, error => console.error(error));
  }

  isDuplicate(): AsyncValidatorFn {
    
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {
      var employee = <Employee>{};

      employee.employeeId = (this.selected?.employeeId) ? this.selected.employeeId : 0;
      employee.firstName = this.form.controls['firstName'].value
      employee.lastName = this.form.controls['lastName'].value
      employee.initials = this.form.controls['initials'].value
      employee.jobId = +this.form.controls['jobId'].value
      employee.yearsOfService = +this.form.controls['yearsOfService'].value
      employee.hireDate = new Date(this.form.controls['hireDate'].value).toISOString()

      var url = environment.baseUrl + 'api/Employees/IsDuplicate';

      return this.http.post<boolean>(url, employee).pipe(map(result => {
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

  calculateYears() {

    let hireYear = new Date(this.form.controls['hireDate'].value).getFullYear()
    let currentYear = new Date().getFullYear()

    this.form.get('yearsOfService')?.patchValue(currentYear - hireYear);
  }
}
