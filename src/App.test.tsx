import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the DemoApp component
jest.mock('./demo/DemoApp', () => ({
  DemoApp: () => <div data-testid="demo-app">Mocked DemoApp</div>
}));

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('demo-app')).toBeInTheDocument();
  });

  it('should render the DemoApp component', () => {
    render(<App />);
    expect(screen.getByTestId('demo-app')).toBeInTheDocument();
    expect(screen.getByText('Mocked DemoApp')).toBeInTheDocument();
  });

  it('should be a functional component', () => {
    expect(typeof App).toBe('function');
  });

  it('should have a display name', () => {
    expect(App.name).toBe('App');
  });
});