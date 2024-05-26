import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { book } from '../book/book';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  routeName: string;
  results: book[] = [];

  constructor(private route: ActivatedRoute) {
    this.routeName = this.route.snapshot.params['term'];
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.results = [];
        data['results']['items'].forEach((item: any) => {
          const newBook: book = item['volumeInfo'];
          newBook.volumeId = item['id'];
          this.results.push(newBook);
        });
      },
      error: (err) => console.error(err),
    });
  }
}
