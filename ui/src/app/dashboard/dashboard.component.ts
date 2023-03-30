import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { httpHeaders } from '../utilities/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() dashboardName: string = '';
  @Input() color: string = 'bg-green-500';
  @Input() tableHeadings: any[] = [];
  @Input() toggleForm: any;
  @Input() form: any;
  @Input() data: any[] = []
  @Input() apiController: string = '';

  @Output() updateSelected = new EventEmitter<string>();


  public searchString: string = '';
  public filters: any = [];
  private filterHeadings: any = [];
  public selectedSortColumn: string = '';
  public selectedSortOrder: "asc" | "desc" = "asc";
  public loading = true;


  public pageIndex = 0;
  public pageSize = 10;
  public totalEntries = 0;
  public totalPages = 0;
  public currentEntries = 0;
  public maxEntries = 0;
  public hasPreviousPage = false;
  public hasNextPage = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.filters = this.tableHeadings.filter((el: any) => el.key != null)
    this.selectedSortOrder = this.tableHeadings[0].key;

    this.getData()

    let filterBox = document.getElementById('filterBox');


    document.addEventListener('click', (e) => {

      if (!filterBox?.contains(e.target as Element)) {
        let filters = document.getElementById('filters');

        if (!filters?.classList.contains('opacity-0')) {
          this.activateFilter()
        }
      }
    })
  }

  getData() {
    this.loading = true;

    var url = environment.baseUrl + `api/${this.apiController}`;
    console.log(url);
    var params = new HttpParams()
      .set("pageIndex", this.pageIndex.toString())
      .set("pageSize", this.pageSize.toString())
      .set("sortColumn", this.selectedSortColumn)
      .set("sortOrder", this.selectedSortOrder)
      .set("filterColumns", this.filterHeadings.join(','))
      .set("filterQuery", this.searchString)

    this.http.get<any>(url, { params: params, headers: httpHeaders }).subscribe(result => {
      this.data = result.data;
      this.totalPages = result.totalPages;
      this.totalEntries = result.totalCount;
      this.hasPreviousPage = result.hasPreviousPage;
      this.hasNextPage = result.hasNextPage;
      this.currentEntries = this.pageSize * (this.pageIndex + 1);
      this.maxEntries = this.totalEntries > this.currentEntries ? this.currentEntries : this.totalEntries;
      this.pageIndex = result.pageIndex;

      this.loading = false;
    })
  }

  search() {
    this.filterHeadings = this.filters.filter((el: any) => el.searchFilter == true).map((el: any) => el.key)

    this.getData();
  }

  activateFilter() {
    let filters = document.getElementById('filters');

    filters!.classList.toggle('opacity-0')
    filters!.classList.toggle('z-50')
  }

  sortData(columnName: string) {
    this.selectedSortOrder = this.selectedSortColumn != columnName ? 'asc' : this.selectedSortOrder == 'asc' ? 'desc' : 'asc';

    this.selectedSortColumn = columnName;

    this.getData();
  }

  keepOrder = (a: any, b: any) => {
    return a;
  }

  changePageSize(event: any) {
    this.pageSize = event.target.value;
    this.getData();
  }

  nextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex += 1;
      this.getData();
    }
  }

  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex -= 1;
      this.getData();
    }
  }

  emitUpdateEvent(row?: string) {
    let selected = this.toggleForm(row);

    this.updateSelected.emit(selected)
  }
}
