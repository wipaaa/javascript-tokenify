const { ContractFactory, utils } = require('ethers');
const Compiler = require('./compiler');
const Linker = require('./linker');
const paths = require('../configs/paths');

module.exports = class Artificer {
  #_compiler = new Compiler();
  #_linker = null;
  #_owner = null;

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

    await this.#_transferContractOwnership(contract);

    return {
      contract: {
        address: contract.address,
        interface: contract.interface,
      },
      receipt,
    };
  }

  owner(address) {
    if (!utils.isAddress(address)) {
      const message = 'Please provide a valid account address.';
      throw new Error(message);
    }

    this.#_owner = address;
    return this;
  }

  #_compile(replacements) {
    return this.#_compiler.from(paths.stub).with(replacements).compile();
  }

  #_pullOwner() {
    const owner = this.#_owner ?? this.#_linker.wallet.address;
    this.#_owner = null;

    return owner;
  }

  async #_transferContractOwnership(contract) {
    const owner = this.#_pullOwner(); // auto reset the owner to null
    await contract.transferOwnership(owner);
  }
};
