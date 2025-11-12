import { render } from '@testing-library/react-native';
import AccueilScreen from '../app/(tabs)/index';

test('renders welcome text', () => {
  const { getByText } = render(<AccueilScreen />);
  expect(getByText('Bienvenue dans Voyages Chrétiens')).toBeTruthy();
});
