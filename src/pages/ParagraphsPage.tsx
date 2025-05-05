import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ParagraphsBoard } from '../organisms/ParagraphsBoard';

const ParagraphsPage: React.FC = () => {
  const route = useRoute();
  const { chapterId, bookId, chapterTitle, bookTitle } = route.params as {
    chapterId: string;
    bookId: string;
    chapterTitle: string;
    bookTitle: string;
  };

  return (
    <ParagraphsBoard
      chapterId={chapterId}
      bookId={bookId}
      chapterTitle={chapterTitle}
      bookTitle={bookTitle}
    />
  );
};

export default ParagraphsPage; 