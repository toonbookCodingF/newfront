export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Lecture: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type LibraryStackParamList = {
  LibraryMain: undefined;
  MenuCreation: undefined;
  FormulaireCreation: undefined;
  OeuvrePage: {
    id: string;
    fromMyBooks?: boolean;
  };
  Paragraphs: {
    chapterId: string;
    bookId: string;
    chapterTitle: string;
    bookTitle: string;
    fromMyBooks?: boolean;
  };
  MyBooks: undefined;
  CreateChapterPage: {
    bookId: string;
  };
  UploadeOeuvreGraph: {
    bookId: string;
  };
}; 