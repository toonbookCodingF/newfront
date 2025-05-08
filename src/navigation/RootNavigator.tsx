import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import FormulaireCreation from '../pages/FormulaireCreation';
import MenuCreation from '../pages/menuCreation';
import OeuvrePage from '../pages/OeuvrePage';
import ParagraphsPage from '../pages/ParagraphsPage';
import CreateChapterPage from '../pages/CreateChapterPage';
import UploadeOeuvreGraph from '../pages/UploadeOeuvreGraph';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          animation: 'none'
        }}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="MenuCreation" component={MenuCreation} />
        <Stack.Screen name="FormulaireCreation" component={FormulaireCreation} />
        <Stack.Screen name="OeuvrePage" component={OeuvrePage} />
        <Stack.Screen name="Paragraphs" component={ParagraphsPage} />
        <Stack.Screen
          name="CreateChapterPage"
          component={CreateChapterPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadeOeuvreGraph"
          component={UploadeOeuvreGraph}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 