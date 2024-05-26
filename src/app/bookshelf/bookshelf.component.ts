import { Component, Input } from '@angular/core';
import { book } from '../book/book';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css'],
})
// Recieves book info from parent class and displays in grid
export class BookshelfComponent {
  @Input() books!: book[];
}
