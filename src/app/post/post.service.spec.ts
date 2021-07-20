import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import { HttpTestingController,HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { IndexComponent } from './index/index.component';
describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let spy: any;
  let component: IndexComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ]});
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeUndefined();
  });

});
