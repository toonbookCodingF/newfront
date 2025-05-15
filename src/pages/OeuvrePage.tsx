import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { OeuvreBoard } from '../organisms/OeuvreBoard';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';

type OeuvrePageRouteProp = RouteProp<RootStackParamList, 'OeuvrePage'>;

const OeuvrePage: React.FC = () => {
  const route = useRoute<OeuvrePageRouteProp>();
  const navigation = useNavigation();
  const { id, fromMyBooks } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 1,
          padding: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <OeuvreBoard
        id={id}
        fromMyBooks={fromMyBooks}
      />
    </View>
  );
};

export default OeuvrePage;
