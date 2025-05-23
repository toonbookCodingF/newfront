import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, LibraryStackParamList } from './types';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import { LibraryPage } from '../organisms/LibraryPage';
import { LectureBoard } from '../organisms/LectureBoard';
import { SearchBoard } from '../organisms/SearchBoard';
import { Ionicons } from '@expo/vector-icons';
import FormulaireCreation from '../pages/FormulaireCreation';
import MenuCreation from '../pages/menuCreation';
import OeuvrePage from '../pages/OeuvrePage';
import ParagraphsPage from '../pages/ParagraphsPage';
import CreateChapterPage from '../pages/CreateChapterPage';
import UploadeOeuvreGraph from '../pages/UploadeOeuvreGraph';
import MyBooks from '../pages/MyBooks';
import { MyReadings } from '../pages/MyReadings';
import { MyFavorites } from '../pages/MyFavorites';

const Tab = createBottomTabNavigator<MainTabParamList>();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();

const LibraryStackNavigator = () => {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="LibraryMain" component={LibraryPage} />
      <LibraryStack.Screen name="MenuCreation" component={MenuCreation} />
      <LibraryStack.Screen name="FormulaireCreation" component={FormulaireCreation} />
      <LibraryStack.Screen name="OeuvrePage" component={OeuvrePage} />
      <LibraryStack.Screen name="Paragraphs" component={ParagraphsPage} />
      <LibraryStack.Screen name="MyBooks" component={MyBooks} />
      <LibraryStack.Screen name="MyReadings" component={MyReadings} />
      <LibraryStack.Screen name="MyFavorites" component={MyFavorites} />
      <LibraryStack.Screen name="CreateChapterPage" component={CreateChapterPage} />
      <LibraryStack.Screen name="UploadeOeuvreGraph" component={UploadeOeuvreGraph} />
    </LibraryStack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#A020F0',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryStackNavigator}
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lecture"
        component={LectureBoard}
        options={{
          title: 'Lectures',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchBoard}
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 