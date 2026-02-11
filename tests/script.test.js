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

    test.each([
      ['en', 'Hello World'],
      ['es', 'Hola Mundo'],
      ['fr', 'Bonjour le Monde'],
      ['de', 'Hallo Welt'],
      ['it', 'Ciao Mondo'],
      ['pt', 'Olá Mundo'],
      ['ja', 'こんにちは世界'],
      ['zh', '你好世界'],
      ['ru', 'Привет мир'],
      ['ar', 'مرحبا بالعالم']
    ])('should create correct greeting in %s', async (lang, expectedGreeting) => {
      const params = {
        first_name: 'Test',
        last_name: 'User',
        language: lang
      };

      const result = await script.invoke(params, mockContext);

      expect(result.message).toBe(`${expectedGreeting}, Test User!`);
      expect(result.language).toBe(lang);
      expect(result.processed_at).toBeDefined();
    });

    test('should throw when first_name is missing', async () => {
      const params = {
        last_name: 'Doe',
        language: 'en'
      };

      await expect(script.invoke(params, mockContext))
        .rejects.toThrow('Missing required parameter: first_name');
    });

    test('should throw when last_name is missing', async () => {
      const params = {
        first_name: 'John',
        language: 'en'
      };

      await expect(script.invoke(params, mockContext))
        .rejects.toThrow('Missing required parameter: last_name');
    });

    test('should throw for unsupported language', async () => {
      const params = {
        first_name: 'John',
        last_name: 'Doe',
        language: 'xx'
      };

      await expect(script.invoke(params, mockContext))
        .rejects.toThrow('Unsupported language: xx');
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

      expect(result).toBeUndefined();
    });

    test('should handle shutdown with different reason', async () => {
      const params = {
        first_name: 'Jane',
        last_name: 'Smith',
        reason: 'cancellation'
      };

      const result = await script.halt(params);

      expect(result).toBeUndefined();
    });

    test('should handle halt without names', async () => {
      const params = {
        reason: 'system_shutdown'
      };

      const result = await script.halt(params);

      expect(result).toBeUndefined();
    });
  });
});
