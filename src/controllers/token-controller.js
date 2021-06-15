const { utils } = require('ethers');
const Artificer = require('../helpers/artificer');
const Linker = require('../helpers/linker');

// FIXME: Erase this configuration while deploy the application!
const pK = '0x79dcb7c5de9b8ef0b76f3399f6a9a9c2904b688f914a6264656fd2217e6e57ad';
const options = {
  privateKey: pK,
  providerOrUrl: 'http://localhost:8545',
};

const linker = new Linker(options);
const artificer = new Artificer(linker);

const _createToken = async (owner, replacements) => {
  return await artificer.owner(owner).create(replacements);
};

const _processCreationReceipt = ({ creation = null, transfer = null }) => {
  if (!creation || !transfer) {
    const message = 'Something went wrong while processing the receipt.';
    throw new Error(message);
  }

  const {
    transactionHash: cHash,
    from: cFrom,
    contractAddress: cTo,
    gasUsed: cGas,
  } = creation;

  const {
    transactionHash: tHash,
    from: tFrom,
    to: tTo,
    gasUsed: tGas,
  } = transfer;

  const totalGas = cGas.add(tGas);

  return {
    creation: {
      detail: 'Contract creation receipt',
      hash: cHash,
      from: cFrom,
      to: cTo,
      gas: `${utils.formatEther(cGas)} ETH`,
    },
    transfer: {
      detail: 'Transfer ownership receipt',
      hash: tHash,
      from: tFrom,
      to: tTo,
      gas: `${utils.formatEther(tGas)} ETH`,
    },
    total: {
      gas: `${utils.formatEther(totalGas)} ETH`,
    },
  };
};

// FIXME: Refactor this function whenever possible
const create = async (req, res) => {
  if (!req?.body?.replacements) {
    return res.json({
      error: true,
      message: 'Please provide the replacements data.',
    });
  }

  try {
    const { owner, replacements } = req.body;
    const { contract, receipt } = await _createToken(owner, replacements);

    return res.status(200).json({
      error: false,
      message: 'Contract created successfully.',
      data: {
        address: contract.address,
        transaction: _processCreationReceipt(receipt),
      },
    });
  } catch (err) {
    return res.json({
      error: true,
      message: err.message,
    });
  }
};

module.exports = {
  create,
};
