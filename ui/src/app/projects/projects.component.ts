import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from './project';
import { decimalRegex, httpHeaders } from './../utilities/constants'


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  public tableHeadings: any[] = [
    { key: 'projectId', text: '#', searchFilter: true },
    { key: 'name', text: 'Name', searchFilter: true },
    { key: 'value', text: 'Value', searchFilter: true },
    { key: 'balance', text: 'Balance', searchFilter: true },
    { key: null, text: 'Edit' }
  ];

  public dashboardName: string = 'Projects'
  public data: Project[] = [];
  public idColumn: string = 'projectId';
  public interfaceName: string = 'Project';
  public error?: string;

  public employees: any[] = []
  public selected?: Project;
  public formTitle: string = '';

  public form = new FormGroup({
    name: new FormControl(
      '',
      Validators.required,
      this.isDupeField('name')
    ),
    value: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(decimalRegex)
      ]
    ),
    balance: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(decimalRegex)
      ]
    ),
    employeeId: new FormControl(
      '',
      Validators.required,
    ),
  }, null, this.isDuplicate())

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadEmployees()
  }

  toggleForm(row: any = {}) {
    this.form.reset();
    this.form.patchValue(row!);

    let form = document.getElementById('form');
    form!.classList.toggle('hidden')

    return row;
  }

  submitForm() {
    let toast = document.getElementById('toast');

    if (this.form.valid) {
      this.error = undefined
      let projectId = this.selected?.projectId

      this.selected!.name = this.form.controls['name'].value!
      this.selected!.value = +this.form.controls['value'].value!
      this.selected!.balance = +this.form.controls['balance'].value!
      this.selected!.employeeId = +this.form.controls['employeeId'].value!

      if (projectId != null) {
        let url = environment.baseUrl + 'api/Projects/' + projectId;

        this.http.put(url, this.selected, { headers: httpHeaders }).subscribe(result => {
          let index = this.data.findIndex((el: any) => el.projectId == projectId)
          this.data[index] = this.selected!;

          toast!.classList.remove('opacity-0')

          setTimeout(() => {
            toast!.classList.add('opacity-0')
            this.toggleForm()

          }, 1000)

        }, error => console.error(error))
      } else {
        let url = environment.baseUrl + 'api/Projects';

        this.http.post(url, this.selected, { headers: httpHeaders }).subscribe(result => {
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

  isDuplicate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {
      var project = <Project>{};

      project.projectId = (this.selected?.projectId) ? this.selected.projectId : 0;
      project.name = this.form.controls['name'].value!;
      project.value = +this.form.controls['value'].value!;
      project.balance = +this.form.controls['balance'].value!;
      project.employeeId = parseInt(this.form.controls['employeeId'].value!)

      var url = environment.baseUrl + 'api/Projects/IsDuplicate';

      return this.http.post<boolean>(url, project, { headers: httpHeaders }).pipe(map(result => {
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

  isDupeField(fieldName: string) {
    return (control: AbstractControl): Observable<{
      [key: string]: any
    } | null> => {
      var params = new HttpParams()
        .set("projectId", (this.selected?.projectId) ? this.selected.projectId : 0)
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      var url = environment.baseUrl + 'api/Jobs/IsDupeField';

      return this.http.post<boolean>(url, null, { params: params, headers: httpHeaders })
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }

}
