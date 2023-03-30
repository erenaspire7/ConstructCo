import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Job } from './job'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { convertToInputDate } from './../utilities/date-helper'
import { decimalRegex, httpHeaders} from './../utilities/constants'


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  public tableHeadings: any[] = [
    { key: 'jobId', text: '#', searchFilter: true },
    { key: 'description', text: 'Description', searchFilter: true },
    { key: 'hourCharge', text: 'HourCharge', searchFilter: true },
    { key: 'lastUpdated', text: 'LastUpdated', searchFilter: true },
    { key: null, text: 'Edit' }
  ];

  public dashboardName: string = 'Jobs'
  public data: Job[] = [];
  public idColumn: string = 'jobId';
  public interfaceName: string = 'Job';
  public error?: string;

  public selected?: Job;
  public formTitle: string = '';
  public form = new FormGroup({
    description: new FormControl(
      '',
      Validators.required,
      this.isDupeField('description'),
    ),
    hourCharge: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(decimalRegex)
      ]
    ),
    lastUpdated: new FormControl('', Validators.required),
  }, null, this.isDuplicate());

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  toggleForm(row: any = {}) {
    this.form.reset();
    this.form.patchValue(row!);

    if (row?.lastUpdated != null) {
      let dateFormat = convertToInputDate(row.lastUpdated)

      this.form.get('lastUpdated')?.patchValue(dateFormat);
    }

    let form = document.getElementById('form');
    form!.classList.toggle('hidden')

    return row;
  }

  submitForm() {
    let toast = document.getElementById('toast');

    if (this.form.valid) {


      this.error = undefined
      let jobId = this.selected?.jobId

      this.selected!.description = this.form.controls['description'].value!
      this.selected!.hourCharge = +this.form.controls['hourCharge'].value!
      this.selected!.lastUpdated = new Date(this.form.controls['lastUpdated'].value!).toISOString()


      if (jobId != null) {
        let url = environment.baseUrl + 'api/Jobs/' + jobId;

        this.http.put(url, this.selected, {headers: httpHeaders}).subscribe(result => {
          let index = this.data.findIndex((el: any) => el.jobId == jobId)
          this.data[index] = this.selected!;

          toast!.classList.remove('opacity-0')

          setTimeout(() => {
            toast!.classList.add('opacity-0')
            this.toggleForm()

          }, 1000)

        }, error => console.error(error))
      } else {
        let url = environment.baseUrl + 'api/Jobs';

        this.http.post(url, this.selected, {headers: httpHeaders}).subscribe(result => {
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
    this.form.get('description')?.updateValueAndValidity({onlySelf: true })
  }

  isDuplicate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {
      var job = <Job>{};

      job.jobId = (this.selected?.jobId) ? this.selected.jobId : 0;
      job.description = this.form.controls['description'].value!;
      job.hourCharge = +this.form.controls['hourCharge'].value!;
      job.lastUpdated = new Date(this.form.controls['lastUpdated'].value!).toISOString();

      var url = environment.baseUrl + 'api/Jobs/IsDuplicate';

      return this.http.post<boolean>(url, job, {headers: httpHeaders}).pipe(map(result => {
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
        .set("jobId", (this.selected?.jobId) ? this.selected.jobId : 0)
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      var url = environment.baseUrl + 'api/Jobs/IsDupeField';

      return this.http.post<boolean>(url, null, { params : params, headers: httpHeaders})
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }
}
