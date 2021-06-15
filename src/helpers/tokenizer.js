module.exports = class Tokenizer {
  #_patterns = {
    parsing: /^__REPLACE_|__$/g,
    tokenizing: /__REPLACE_(\w+)__/g,
  };

  #_replacements = {
    decimals: 18,
    supply: {
      max: 0,
      total: 10,
    },
  };

  tokenize(content) {
    if (typeof content !== 'string') {
      const message = 'Please provide a valid content string.';
      throw new Error(message);
    }

    return content.replace(this.#_patterns.tokenizing, (token) => {
      const keys = this.#_parseToken(token);
      return this.#_resolveKeys(keys, this.#_replacements);
    });
  }

  with(replacements) {
    if (!replacements || typeof replacements !== 'object') {
      const message = 'Please provide a valid replacements object.';
      throw new Error(message);
    }

    this.#_mergeReplacements(replacements);
    return this;
  }

  #_mergeReplacements(newReplacements = {}) {
    if (!newReplacements.name && !newReplacements.symbol) {
      const message = 'Property name and symbol are required.';
      throw new Error(message);
    }

    this.#_replacements = {
      ...this.#_replacements,
      ...newReplacements,
    };
  }

  #_parseToken(key) {
    if (!this.#_patterns.parsing.test(key)) {
      return [];
    }

    return key.replace(this.#_patterns.parsing, '').toLowerCase().split('_');
  }

  #_resolveKeys(keys, replacements) {
    const MIN_KEYS_LENGTH = 1;

    if (keys.length > MIN_KEYS_LENGTH) {
      const result = replacements[keys.shift()];
      return this.#_resolveKeys(keys, result);
    }

    const result = replacements[keys.shift()];
    return result;
  }
};
