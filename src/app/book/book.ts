// export interface book {
//   id: string;
//   title: string;
//   authors: string[];
//   cover: string;
//   description: string;
//   publishedDate: string;
//   printType: string;
//   categories: string[];
// }

export interface book {
  title: string;
  authors: string[];
  imageLinks: object;
  description: string;
  publishedDate: string;
  printType: string;
  categories: string[];
  language: string;
  pageCount: number;
  publisher: string;
}
