const solc = require('solc');
const Resolver = require('./resolver');
const Tokenizer = require('./tokenizer');

module.exports = class Compiler {
  #_resolver = new Resolver();
  #_tokenizer = new Tokenizer();

  compile() {
    const sources = this.#_resolveSources();
    const input = this.#_generateInput(sources);
    const compiled = JSON.parse(solc.compile(input));

    return this.#_extractCompiledSources(compiled);
  }

  from(directory) {
    this.#_resolver.from(directory);
    return this;
  }

  with(replacements) {
    this.#_tokenizer.with(replacements);
    return this;
  }

  #_extractCompiledSources(sources) {
    const result = {};

    if (!sources.contracts) {
      const message = 'Please provide a valid compiled sources.';
      throw new Error(message);
    }

    for (const fName in sources.contracts) {
      for (const cName in sources.contracts[fName]) {
        result[fName.slice(0, -4)] = sources.contracts[fName][cName];
      }
    }

    return result;
  }

  #_generateInput(sources) {
    if (!sources || typeof sources !== 'object') {
      const message = 'Please provide a valid sources type.';
      throw new Error(message);
    }

    return JSON.stringify({
      language: 'Solidity',
      sources,
      settings: {
        outputSelection: {
          ['*']: { ['*']: ['abi', 'evm.bytecode.object'] },
        },
      },
    });
  }

  #_resolveSources() {
    return this.#_resolver.resolve().reduce((merged, source) => {
      const { content, name } = source;

      return {
        ...merged,
        [name]: { content: this.#_tokenizer.tokenize(content) },
      };
    }, {});
  }
};
