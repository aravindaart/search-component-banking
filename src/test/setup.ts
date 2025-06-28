import '@testing-library/jest-dom';

// Mock scrollIntoView globally
Element.prototype.scrollIntoView = jest.fn();

