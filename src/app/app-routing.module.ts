import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { bookResolver } from './resolvers/book.resolver';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { listResolver } from './resolvers/list.resolver';

const routes: Routes = [
  // { path: 'books', component: BookComponent },
  {
    path: 'book/:volumeId',
    component: BookComponent,
    resolve: { book: bookResolver },
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'list/:name',
    component: ListComponent,
    resolve: { bookList: listResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
