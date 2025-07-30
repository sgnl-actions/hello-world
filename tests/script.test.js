// Import jest globals for extended Jest API if needed
// import { jest } from '@jest/globals';
import script from '../src/script.mjs';

describe('Hello World Job Script', () => {
  const mockContext = {
    env: {
      ENVIRONMENT: 'test'
    },
    secrets: {
      API_KEY: 'test-api-key-123456'
    },
    outputs: {},
    partial_results: {},
    current_step: 'start'
  };

  describe('invoke handler', () => {
    test('should create hello world message with all parameters', async () => {
      const params = {
        first_name: 'John',
        last_name: 'Doe',
        language: 'en'
      };

      const result = await script.invoke(params, mockContext);

      expect(result.message).toBe('Hello World, John Doe!');
      expect(result.language).toBe('en');
      expect(result.processed_at).toBeDefined();
    });

    test('should handle missing language with random selection', async () => {
      const params = {
        first_name: 'Jane',
        last_name: 'Smith'
      };

      const result = await script.invoke(params, mockContext);

      expect(result.message).toMatch(/^.+, Jane Smith!$/);
      expect(result.language).toBeDefined();
      expect(['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ru', 'ar']).toContain(result.language);
      expect(result.processed_at).toBeDefined();
    });

    test('should create message in Spanish', async () => {
      const params = {
        first_name: 'Maria',
        last_name: 'Garcia',
        language: 'es'
      };

      const result = await script.invoke(params, mockContext);

      expect(result.message).toBe('Hola Mundo, Maria Garcia!');
      expect(result.language).toBe('es');
      expect(result.processed_at).toBeDefined();
    });

    test('should create message in French', async () => {
      const params = {
        first_name: 'Pierre',
        last_name: 'Dupont',
        language: 'fr'
      };

      const result = await script.invoke(params, mockContext);

      expect(result.message).toBe('Bonjour le Monde, Pierre Dupont!');
      expect(result.language).toBe('fr');
      expect(result.processed_at).toBeDefined();
    });
  });

  describe('error handler', () => {
    test('should recover from language-related errors', async () => {
      const params = {
        first_name: 'John',
        last_name: 'Doe',
        language: 'invalid',
        error: {
          message: 'Invalid language specified',
          code: 'LANGUAGE_ERROR'
        }
      };

      const result = await script.error(params);

      expect(result.message).toBe('Hello World, John Doe!');
      expect(result.language).toBe('en');
      expect(result.processed_at).toBeDefined();
    });

    test('should recover from greeting-related errors', async () => {
      const params = {
        first_name: 'Jane',
        last_name: 'Smith',
        error: {
          message: 'Failed to load greeting template',
          code: 'GREETING_ERROR'
        }
      };

      const result = await script.error(params);

      expect(result.message).toBe('Hello World, Jane Smith!');
      expect(result.language).toBe('en');
      expect(result.processed_at).toBeDefined();
    });

    test('should throw for unrecoverable errors', async () => {
      const params = {
        first_name: 'John',
        last_name: 'Doe',
        error: {
          message: 'Database connection failed',
          code: 'DB_ERROR'
        }
      };

      await expect(script.error(params)).rejects.toThrow('Unrecoverable error creating greeting');
    });
  });

  describe('halt handler', () => {
    test('should handle graceful shutdown', async () => {
      const params = {
        first_name: 'John',
        last_name: 'Doe',
        reason: 'timeout'
      };

      const result = await script.halt(params);

      expect(result).toBeUndefined(); // halt method doesn't return anything
    });

    test('should handle shutdown with different reason', async () => {
      const params = {
        first_name: 'Jane',
        last_name: 'Smith',
        reason: 'cancellation'
      };

      const result = await script.halt(params);

      expect(result).toBeUndefined(); // halt method doesn't return anything
    });

    test('should handle halt without names', async () => {
      const params = {
        reason: 'system_shutdown'
      };

      const result = await script.halt(params);

      expect(result).toBeUndefined(); // halt method doesn't return anything
    });
  });
});