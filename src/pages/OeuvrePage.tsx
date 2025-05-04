import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { OeuvreBoard } from '../components/organisms/OeuvreBoard';
import { Ionicons } from '@expo/vector-icons';

const OeuvrePage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

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
      />
    </View>
  );
};

export default OeuvrePage;
