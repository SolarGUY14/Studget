import { act, fireEvent, render, screen } from '@testing-library/react-native';
import DashboardScreen from '../src/screens/DashboardScreen';
import { getHealth } from '../src/api/client';

jest.mock('../src/api/client', () => ({ getHealth: jest.fn() }));
const healthMock = jest.mocked(getHealth);
beforeEach(() => healthMock.mockReset());

test('shows loading and honest empty financial states', async () => {
  healthMock.mockReturnValue(new Promise(() => {}));
  render(<DashboardScreen />);
  expect(screen.getByText('Checking connection…')).toBeTruthy();
  expect(screen.getByText('Safe to spend')).toBeTruthy();
  expect(screen.getByText(/No transactions yet/)).toBeTruthy();
});

test('shows a successful connection', async () => {
  healthMock.mockResolvedValue({ status: 'healthy' });
  render(<DashboardScreen />);
  expect(await screen.findByText('Connected to Studget')).toBeTruthy();
});

test('recovers from an error when the user retries', async () => {
  healthMock
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce({ status: 'healthy' });
  render(<DashboardScreen />);
  await screen.findByText(/Unable to connect/);
  await act(async () => {
    fireEvent.press(screen.getByRole('button', { name: 'Retry connection' }));
  });
  expect(await screen.findByText('Connected to Studget')).toBeTruthy();
  expect(healthMock).toHaveBeenCalledTimes(2);
});
