import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CreateForm } from '../organisms/CreateForm';

type FormulaireCreationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FormulaireCreation: React.FC = () => {
  const navigation = useNavigation<FormulaireCreationNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <CreateForm onBack={handleBack} />
    </View>
  );
};

export default FormulaireCreation; 