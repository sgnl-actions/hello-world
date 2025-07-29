/**
 * SGNL Hello World Job
 * 
 * Creates personalized hello world messages in multiple languages.
 */

export default {
  /**
   * Main execution handler - creates hello world message
   * @param {Object} params - Job input parameters
   * @param {Object} context - Execution context with env, secrets, outputs
   * @returns {Object} Job results
   */
  invoke: async (params, context) => {
    console.log('Starting hello world job execution');
    
    const { first_name, last_name, language } = params;
    
    // Define supported languages and their greetings
    const greetings = {
      en: 'Hello World',
      es: 'Hola Mundo',
      fr: 'Bonjour le Monde',
      de: 'Hallo Welt',
      it: 'Ciao Mondo',
      pt: 'Olá Mundo',
      ja: 'こんにちは世界',
      zh: '你好世界',
      ru: 'Привет мир',
      ar: 'مرحبا بالعالم'
    };
    
    // Select language - use provided language or random if not provided
    let selectedLanguage = language;
    if (!selectedLanguage) {
      const supportedLanguages = Object.keys(greetings);
      selectedLanguage = supportedLanguages[Math.floor(Math.random() * supportedLanguages.length)];
      console.log(`No language specified, randomly selected: ${selectedLanguage}`);
    }
    
    console.log(`Creating greeting in ${selectedLanguage} for ${first_name} ${last_name}`);
    
    // Create the personalized message
    const greeting = greetings[selectedLanguage];
    const message = `${greeting}, ${first_name} ${last_name}!`;
    
    console.log(`Generated message: ${message}`);
    
    // Return structured results
    return {
      message: message,
      language: selectedLanguage,
      processed_at: new Date().toISOString()
    };
  },

  /**
   * Error recovery handler - implement error handling logic
   * @param {Object} params - Original params plus error information
   * @returns {Object} Recovery results
   */
  error: async (params) => {
    const { error, first_name, last_name, language } = params;
    console.error(`Hello world job encountered error for ${first_name} ${last_name}: ${error.message}`);
    
    // Try to provide a fallback greeting in English if language selection failed
    if (error.message.includes('language') || error.message.includes('greeting')) {
      console.log('Language error detected - falling back to English');
      
      return {
        message: `Hello World, ${first_name} ${last_name}!`,
        language: 'en',
        processed_at: new Date().toISOString()
      };
    }
    
    // Cannot recover from this error
    console.error(`Unable to recover from error for ${first_name} ${last_name}`);
    throw new Error(`Unrecoverable error creating greeting: ${error.message}`);
  },

  /**
   * Graceful shutdown handler - implement cleanup logic
   * @param {Object} params - Original params plus halt reason
   */
  halt: async (params) => {
    const { reason, first_name, last_name } = params;
    console.log(`Hello world job is being halted (${reason}) for ${first_name} ${last_name}`);
    
    // No significant cleanup needed for hello world job
    console.log('Performing minimal cleanup operations');
  }
};