import { ethers } from 'ethers';

class ExtendedSmartAccountSigner {
    constructor(smartAccountSigner, provider) {
        this.smartAccountSigner = smartAccountSigner;
        this.provider = new ethers.providers.Web3Provider(provider); 
        this.address = smartAccountSigner.address;

        // Patch the signTypedData method to work correctly
        this.signTypedData = function(domain, types, value) {
            return this._signTypedData(domain, types, value);
        };
    }

    async getAddress() {
        return this.address;
    }

    async signMessage(message) {
        return this.smartAccountSigner.signMessage({ message: ethers.utils.arrayify(message) });
    }

    async signTransaction(transaction) {
        const populatedTransaction = await this.populateTransaction(transaction);
        const serializedTransaction = ethers.utils.serializeTransaction(populatedTransaction);
        return this.provider.send('eth_signTransaction', [serializedTransaction]);
    }

    async _signTypedData(domain, types, value) {
        // Validate and debug the typed data
        console.log('TypedData domain:', domain);
        console.log('TypedData types:', types);
        console.log('TypedData value:', value);

        return this.smartAccountSigner.signTypedData(domain, types, value);
    }

    async sendTransaction(transaction) {
        const signedTransaction = await this.signTransaction(transaction);
        try {
            const response = await this.provider.sendTransaction(signedTransaction);
            return response;
        } catch (error) {
            console.error('Error sending transaction:', error);
            throw error;
        }
    }

    async populateTransaction(transaction) {
        const tx = { ...transaction };
        if (!tx.gasLimit) {
            tx.gasLimit = await this.provider.estimateGas(tx);
        }
        if (!tx.nonce) {
            tx.nonce = await this.provider.getTransactionCount(this.address);
        }
        if (!tx.gasPrice) {
            tx.gasPrice = await this.provider.getGasPrice();
        }
        return tx;
    }

    connect(provider) {
        this.provider = new ethers.providers.Web3Provider(provider);
        return this;
    }

    async resolveName(name) {
        return this.provider.resolveName(name);
    }
}

export default ExtendedSmartAccountSigner;
