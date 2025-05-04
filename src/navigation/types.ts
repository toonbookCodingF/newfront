export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MenuCreation: undefined;
  TestRedirection: undefined;
  OeuvrePage: {
    id: string;
  };
  LecturePage: undefined;
  Create: {
    bookId: string;
  };
  UploadeOeuvreGraph: {
    bookId: string;
  };
  FormulaireCreation: undefined;
  Paragraphs: {
    chapterId: string;
    bookId: string;
    chapterTitle: string;
    bookTitle: string;
  };
  Comments: {
    chapterId: string;
    bookId: string;
    chapterTitle: string;
    bookTitle: string;
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