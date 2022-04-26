import { generateKeyPairSync } from "crypto";
import Transaction from './Transaction';
import type Blockchain from './Blockchain';

class Wallet {
    readonly privateKey: string;
    readonly publicKey: string;

    constructor() {
        const keyPair = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            },
        });
        this.privateKey = keyPair.privateKey;
        this.publicKey = keyPair.publicKey;
    }

    send(amount: number, receiverPublicKey: string, blockChain: Blockchain): void {
        const transaction = new Transaction(this.publicKey, receiverPublicKey, amount);
        transaction.sign(this);
        blockChain.addTransaction(transaction);
    }
}

export default Wallet;
