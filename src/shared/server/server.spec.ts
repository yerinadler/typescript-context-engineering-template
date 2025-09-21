import { Router } from 'express';
import { Controller } from '../controller/controller.interface';
import { Server } from './index';

// Mock controller for testing
class MockController implements Controller {
  public readonly basePath = '/test';
  public readonly router = Router();
}

// Interface for mock server
interface MockHttpServer {
  close: jest.MockedFunction<(callback?: (err?: Error) => void) => void>;
}

describe('Server', () => {
  let server: Server;
  let processExitSpy: jest.SpyInstance;
  let processOnSpy: jest.SpyInstance;

  beforeEach(() => {
    server = new Server();

    // Mock process.exit to prevent actual exit
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });

    // Mock process.on to track signal handlers
    processOnSpy = jest.spyOn(process, 'on').mockReturnValue(process);
  });

  afterEach(() => {
    processExitSpy.mockRestore();
    processOnSpy.mockRestore();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('constructor', () => {
    it('creates a server instance', () => {
      expect(server).toBeInstanceOf(Server);
    });
  });

  describe('registerController', () => {
    it('allows registering controllers', () => {
      const mockController = new MockController();
      expect(() => server.registerController(mockController)).not.toThrow();
    });
  });

  describe('run', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sets up graceful shutdown signal handlers', () => {
      const port = 3000;
      server.run(port);

      expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    });
  });

  describe('graceful shutdown', () => {
    let mockServer: MockHttpServer;
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.useFakeTimers();
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mock the http server
      mockServer = {
        close: jest.fn(),
      };

      // Access private server instance
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any)._server = mockServer;
    });

    afterEach(() => {
      jest.useRealTimers();
      consoleLogSpy.mockRestore();
    });

    it('handles SIGINT signal gracefully', () => {
      mockServer.close.mockImplementation((callback?: (err?: Error) => void) => {
        if (callback) callback();
      });

      // Simulate calling the graceful shutdown handler directly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');

      expect(consoleLogSpy).toHaveBeenCalledWith('\nReceived SIGINT. Starting graceful shutdown...');
      expect(mockServer.close).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('handles SIGTERM signal gracefully', () => {
      mockServer.close.mockImplementation((callback?: (err?: Error) => void) => {
        if (callback) callback();
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGTERM');

      expect(consoleLogSpy).toHaveBeenCalledWith('\nReceived SIGTERM. Starting graceful shutdown...');
      expect(mockServer.close).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('forces shutdown after 15 second timeout', () => {
      // Mock server.close to not call the callback (simulate hanging connections)
      mockServer.close.mockImplementation(() => {
        // Don't call callback to simulate pending connections
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');

      // Fast forward 15 seconds
      jest.advanceTimersByTime(15000);

      expect(consoleLogSpy).toHaveBeenCalledWith('Graceful shutdown timeout reached. Forcing shutdown...');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('prevents multiple shutdown attempts', () => {
      mockServer.close.mockImplementation((callback?: (err?: Error) => void) => {
        if (callback) callback();
      });

      // Call graceful shutdown twice
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');

      // Should only log once
      expect(consoleLogSpy).toHaveBeenCalledTimes(2); // Once for the signal, once for success
      expect(mockServer.close).toHaveBeenCalledTimes(1);
    });

    it('handles server close error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Close error');

      mockServer.close.mockImplementation((callback?: (err?: Error) => void) => {
        if (callback) callback(error);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error during graceful shutdown:', error);
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockRestore();
    });

    it('exits immediately when no server instance exists', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any)._server = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (server as any).gracefulShutdown('SIGINT');

      expect(consoleLogSpy).toHaveBeenCalledWith('No server instance found. Exiting immediately.');
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });
});
