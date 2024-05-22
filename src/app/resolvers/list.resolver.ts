import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { BookService } from '../services/book.service';
import { book } from '../book/book';

export const listResolver: ResolveFn<book[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(BookService).getUserBooks();
};
