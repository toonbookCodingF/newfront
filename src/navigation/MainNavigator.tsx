import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import { LibraryPage } from '../organisms/LibraryPage';
import { LectureBoard } from '../organisms/LectureBoard';
import { SearchBoard } from '../organisms/SearchBoard';
import { Ionicons } from '@expo/vector-icons';
import { RegisterPage } from '../pages/RegisterPage';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Lecture') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'home';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A020F0',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage}
        options={{
          title: 'Accueil',
        }}
      />

      <Tab.Screen 
        name="Library" 
        component={LibraryPage}
        options={{
          title: 'Bibliothèque',
        }}
      />
      <Tab.Screen 
        name="Lecture" 
        component={LectureBoard}
        options={{
          title: 'Lectures',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchBoard}
        options={{
          title: 'Recherche',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage}
        options={{
          title: 'Profil',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          title: 'Paramètres',
        }}
      />
    </Tab.Navigator>
  );
}; 