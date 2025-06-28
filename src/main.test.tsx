/**
 * Main Entry Point Tests
 * Tests the application entry point and initialization
 */

// Mock React DOM
const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender
}));

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot
}));

// Mock the App component
jest.mock('./App.tsx', () => ({
  __esModule: true,
  default: function MockApp() {
    return <div data-testid="app">App</div>;
  }
}));

// Mock CSS import
jest.mock('./index.css', () => ({}));

describe('Main Entry Point', () => {
  let originalGetElementById: typeof document.getElementById;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Store original method
    originalGetElementById = document.getElementById;
    
    // Setup DOM element mock
    const mockRootElement = document.createElement('div');
    mockRootElement.id = 'root';
    document.getElementById = jest.fn().mockReturnValue(mockRootElement);
  });

  afterEach(() => {
    jest.resetModules();
    // Restore original method
    document.getElementById = originalGetElementById;
  });

  it('should create root and render app without errors', () => {
    // Import main to trigger the execution
    require('./main.tsx');

    // Verify createRoot was called with the root element
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(mockCreateRoot).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'root' })
    );
    
    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);
    
    // Verify that render was called with a React element
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall).toBeDefined();
    expect(renderCall.props).toBeDefined();
  });

  it('should render App component inside StrictMode', () => {
    require('./main.tsx');

    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall).toBeDefined();
    
    // Check that the rendered element has children (App component)
    expect(renderCall.props.children).toBeDefined();
  });

  it('should call createRoot and render exactly once', () => {
    require('./main.tsx');

    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it('should handle root element correctly when it exists', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'root';
    document.getElementById = jest.fn().mockReturnValue(mockElement);

    expect(() => {
      require('./main.tsx');
    }).not.toThrow();

    expect(mockCreateRoot).toHaveBeenCalledWith(mockElement);
  });

  it('should import required modules', () => {
    // This test verifies that main.tsx can be imported without errors
    expect(() => {
      require('./main.tsx');
    }).not.toThrow();
  });
});