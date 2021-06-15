const fs = require('fs');
const path = require('path');

module.exports = class Resolver {
  #_encoding = 'utf-8';
  #_from = null;

  from(directory) {
    if (!fs.existsSync(directory)) {
      const message = 'Please provide a exists directory path.';
      throw new Error(message);
    }

    this.#_from = directory;
    return this;
  }

  resolve() {
    return this.#_readSources().map((source) => {
      return this.#_createSourceObject(source, this.#_readContentAt(source));
    });
  }

  #_createSourceObject(name, content) {
    const name_ = name.replace('.txt', '.sol');
    const content_ = content;

    return {
      name: name_,
      content: content_,
      file: {
        name,
        directory: this.#_from,
        path: path.join(this.#_from, name),
      },
    };
  }

  #_readContentAt(source) {
    return fs
      .readFileSync(path.join(this.#_from, source), this.#_encoding)
      .toString();
  }

  #_readSources() {
    return fs.readdirSync(this.#_from, this.#_encoding);
  }
};
