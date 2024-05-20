import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { bookResolver } from './book.resolver';
import { HomeComponent } from './home/home.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
