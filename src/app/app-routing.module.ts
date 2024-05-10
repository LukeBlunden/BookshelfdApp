import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { bookResolver } from './book.resolver';

const routes: Routes = [
  // { path: 'books', component: BookComponent },
  {
    path: 'book/:vid',
    component: BookComponent,
    resolve: { book: bookResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
