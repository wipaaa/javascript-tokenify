const {
  providers: { JsonRpcProvider },
  Wallet,
} = require('ethers');
const constants = require('../configs/constants');

module.exports = class Linker {
  #_provider = null;
  #_wallet = null;
  #_options = {
    privateKey: constants.accountKey,
    providerOrUrl: constants.uriRemoteProvider,
  };

  constructor(options = {}) {
    this.#_mergeOptions(options);
  }

  async connect() {
    this.#_provider = new JsonRpcProvider(this.#_options.providerOrUrl);
    await this.#_provider.ready; // await to provider to be connected
    this.#_wallet = new Wallet(this.#_options.privateKey, this.#_provider);
  }

  #_mergeOptions(options) {
    this.#_options = {
      ...this.#_options,
      ...options,
    };
  }

  get provider() {
    return this.#_provider;
  }

  get wallet() {
    return this.#_wallet;
  }
};
