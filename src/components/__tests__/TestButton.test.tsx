import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TestButton } from '../TestButton';

describe('TestButton Component', () => {
    it('renders correctly with title', () => {
        const { getByText } = render(
            <TestButton onPress={() => { }} title="Test Button" />
        );
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByTestId } = render(
            <TestButton onPress={onPressMock} title="Test Button" />
        );

        const button = getByTestId('test-button');
        fireEvent.press(button);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
}); 