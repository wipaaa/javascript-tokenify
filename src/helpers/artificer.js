const { ContractFactory } = require('ethers');
const Compiler = require('./compiler');
const Linker = require('./linker');
const paths = require('../configs/paths');

module.exports = class Artificer {
  #_compiler = new Compiler();
  #_linker = null;

  constructor(linker) {
    this.#_linker = linker;
  }

  async create(replacements) {
    await this.#_linker.connect();

    const signer = this.#_linker.wallet;
    const compiled = this.#_compile(replacements);
    const factory = ContractFactory.fromSolidity(compiled.Token, signer);
    const contract = await factory.deploy();
    const receipt = await contract.deployTransaction.wait();

    return {
      address: contract.address,
      receipt,
    };
  }

  #_compile(replacements) {
    return this.#_compiler.from(paths.stub).with(replacements).compile();
  }
};
