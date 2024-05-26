import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { book } from '../book/book';
import { inject } from '@angular/core';
import { BookService } from '../services/book.service';

export const searchResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const type = route.paramMap.get('type');
  const term = route.paramMap.get('term');
  switch (type) {
    case 'author':
      return inject(BookService).searchAuthor(term!);
      break;
    case 'all':
      return inject(BookService).searchBooks(term!);
      break;
  }
  return;
};
