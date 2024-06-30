// import { Signer, utils } from 'ethers';

// class CustomSigner extends Signer {
//   constructor(smartAccountSigner, provider) {
//     super();
//     this.smartAccountSigner = smartAccountSigner;
//     this.provider = provider;
//   }

//   async getAddress() {
//     return this.smartAccountSigner.address;
//   }

//   async signMessage(message) {
//     return this.smartAccountSigner.signMessage({ message });
//   }

//   async signTransaction(transaction) {
//     const tx = await this.populateTransaction(transaction);
//     tx.from = await this.getAddress();

//     if (!tx.gasPrice) {
//       const gasPrice = await this.getGasPrice();
//       tx.gasPrice = gasPrice;
//     }

//     if (!tx.nonce) {
//       const nonce = await this.getTransactionCount();
//       tx.nonce = nonce;
//     }

//     // Ensure tx.to is always treated as an address
//     if (tx.to && !utils.isAddress(tx.to)) {
//       throw new Error(`Invalid address: ${tx.to}`);
//     }

//     const signedTx = await this.smartAccountSigner.signTypedData(tx);
//     return signedTx;
//   }

//   async sendTransaction(transaction) {
//     const signedTx = await this.signTransaction(transaction);
//     return this.provider.sendTransaction(signedTx);
//   }

//   async estimateGas(transaction) {
//     return this.provider.estimateGas(transaction);
//   }

//   async call(transaction, blockTag) {
//     return this.provider.call(transaction, blockTag);
//   }

//   async resolveName(name) {
//     if (this.provider.resolveName) {
//       return this.provider.resolveName(name);
//     } else {
//       console.warn('resolveName not supported by provider');
//       // Return null as fallback
//       return null;
//     }
//   }

//   async getGasPrice() {
//     if (this.provider.getGasPrice) {
//       return this.provider.getGasPrice();
//     } else {
//       console.warn('getGasPrice not supported by provider, using fallback gas price');
//       return utils.parseUnits('20', 'gwei');
//     }
//   }

//   async getFeeData() {
//     if (this.provider.getFeeData) {
//       return this.provider.getFeeData();
//     } else {
//       const gasPrice = await this.getGasPrice();
//       return {
//         maxFeePerGas: gasPrice,
//         maxPriorityFeePerGas: gasPrice,
//         gasPrice,
//       };
//     }
//   }

//   async getTransactionCount() {
//     if (this.provider.getTransactionCount) {
//       return this.provider.getTransactionCount(await this.getAddress());
//     } else {
//       console.warn('getTransactionCount not supported by provider, using fallback transaction count');
//       // Fallback to 0 for the nonce; this is not ideal for production
//       return 0;
//     }
//   }

//   async getChainId() {
//     if (this.provider.getNetwork) {
//       const network = await this.provider.getNetwork();
//       return network.chainId;
//     } else if (this.provider.getChainId) {
//       return this.provider.getChainId();
//     } else {
//       console.warn('getChainId not supported by provider, using fallback chain ID');
//       // Fallback to chain ID 1 (Ethereum mainnet); adjust as needed
//       return 1;
//     }
//   }

//   connect(provider) {
//     return new CustomSigner(this.smartAccountSigner, provider);
//   }
// }

// export default CustomSigner;
