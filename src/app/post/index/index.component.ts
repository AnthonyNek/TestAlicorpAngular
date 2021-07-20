import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';
import {DataSource} from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DeleteDialogComponent } from './dialogs/delete.dialog.component';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
 
  displayedColumns = ['id', 'nombre', 'descripcion','actions'];

  dataSource!: ExampleDataSource | null;
  
  posts: Post[] = [];
  

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  exampleDatabase!: PostService | null;
  constructor(public httpClient: HttpClient,
    public dialogService: MatDialog) {}
  ngOnInit() {
    this.loadData();
  }

  reload() {
    this.loadData();
  }


  deleteItem(i: number, id: number, title: string, descripcion: string) {

    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      data: {id: id, title: title, descripcion: descripcion}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }
  private refreshTable() {
    this.paginator?._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.exampleDatabase = new PostService(this.httpClient);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
   
  }
}
export class ExampleDataSource extends DataSource<Post> {
 
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Post[] = [];
  renderedData: Post[] = [];

  constructor(public _exampleDatabase: PostService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Post[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAll();


    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._exampleDatabase.data.slice().filter((post: Post) => {
          const searchStr = (post.id + post.title + post.body).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }
    disconnect() {}


    /** Returns a sorted copy of the database data. */
    sortData(data: Post[]): Post[] {
      if (!this._sort.active || this._sort.direction === '') {
        return data;
      }
  
      return data.sort((a, b) => {
        let propertyA: number | string = '';
        let propertyB: number | string = '';
  
        switch (this._sort.active) {
          case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
          case 'nombre': [propertyA, propertyB] = [a.title, b.title]; break;
          case 'descripcion': [propertyA, propertyB] = [a.body, b.body]; break;
        }
  
        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  
        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
