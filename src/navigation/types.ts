export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MenuCreation: undefined;
  TestRedirection: undefined;
  Create: { bookId: string };
  UploadeOeuvreGraph: { bookId: string };
  CreateChapterPage: { bookId: string };
  OeuvrePage: {
    id: string;
    fromMyBooks?: boolean;
  };
  LecturePage: undefined;
  FormulaireCreation: undefined;
  MyBooks: undefined;
  Paragraphs: {
    chapterId: string;
    bookId: string;
    chapterTitle: string;
    bookTitle: string;
    fromMyBooks?: boolean;
  };
  Comments: {
    bookContentId: string;
  };
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