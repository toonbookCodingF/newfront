require('@testing-library/jest-native/extend-expect');

// Mock pour les icônes Expo
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons'
}));

// Mock pour les images
jest.mock('react-native/Libraries/Image/Image', () => ({
    ...jest.requireActual('react-native/Libraries/Image/Image'),
    resolveAssetSource: () => ({ uri: 'mocked-uri' })
})); 