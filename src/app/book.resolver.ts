import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { book } from './book/book';
import { inject } from '@angular/core';
import { BookService } from './services/book.service';
import { Observable } from 'rxjs';

export const bookResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<any> => {
  return inject(BookService).getBook(route.paramMap.get('vid')!);
};
