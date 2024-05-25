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
  readStatus: boolean | null;
  volumeId: string;
  title: string;
  authors: string[];
  imageLinks: {
    thumbnail: string;
    smallThumbnail: string;
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
  description: string;
  publishedDate: string;
  printType: string;
  categories: string[];
  language: string;
  pageCount: number;
  publisher: string;
}
