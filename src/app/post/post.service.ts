import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   
import {  BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from '../../environments/environment'
import { Post } from './post';
@Injectable({
  providedIn: 'root'
})
export class PostService {

 
  private readonly API_URL=environment.ApiRest;

  dataChange: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) { }

  get data(): Post[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAll(): void {
    this.httpClient.get<Post[]>(this.API_URL+"/posts/").subscribe(data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }
  delete(id: number): void {
    this.httpClient.delete(this.API_URL+"/posts/"+id).subscribe(res => {
      alert("Se elimino correctamente");
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }
}
