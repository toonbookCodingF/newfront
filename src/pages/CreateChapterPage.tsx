import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CreateChapterBoard } from '../organisms/CreateChapterBoard';
import { RootStackParamList } from '../navigation/types';

type CreateChapterPageRouteProp = RouteProp<RootStackParamList, 'CreateChapterPage'>;

export default function CreateChapterPage() {
  const route = useRoute<CreateChapterPageRouteProp>();
  const { bookId, nextOrder } = route.params;
  
  if (!bookId) {
    return null;
  }

  return <CreateChapterBoard bookId={bookId} nextOrder={nextOrder} />;
} 