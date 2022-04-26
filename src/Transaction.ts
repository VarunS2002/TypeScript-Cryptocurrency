import { v4 } from "uuid";
import {
    createSign,
    createVerify,
} from "crypto";
import NetworkWallet from "./NetworkWallet";
import { calculateHash } from "./utilities";
import type Blockchain from "./Blockchain";
import type Wallet from "./Wallet";

class Transaction {
    private readonly id = v4();
    readonly senderPublicKey: string;
    readonly receiverPublicKey: string;
    readonly amount: number;
    readonly hash: string;
    private signature: string | undefined;

    constructor(senderPublicKey: string, receiverPublicKey: string, amount: number) {
        this.senderPublicKey = senderPublicKey;
        this.receiverPublicKey = receiverPublicKey;
        this.amount = amount;
        this.hash = calculateHash(this.senderPublicKey + this.receiverPublicKey + this.amount + this.id);
    }

    isValid(blockChain: Blockchain): boolean {
        if (this.signature === undefined) return false;
        const signature = Buffer.from(this.signature, 'base64');
        const verify = createVerify('sha256');
        verify.update(this.hash);
        const isVerified = verify.verify(this.senderPublicKey, signature);
        const hashForVerification = calculateHash(
            this.senderPublicKey + this.receiverPublicKey + this.amount + this.id
        );
        const hasSufficientBalance = blockChain.getBalance(this.senderPublicKey) >= this.amount;
        const senderKeySameAsWalletKey = this.senderPublicKey === NetworkWallet.publicKey;

        return isVerified && hashForVerification === this.hash && (hasSufficientBalance || senderKeySameAsWalletKey);

    }

    sign(wallet: Wallet): void {
        if (wallet.publicKey === this.senderPublicKey) {
            const shaSign = createSign("sha256");
            shaSign.update(this.hash).end();
            this.signature = shaSign.sign(wallet.privateKey).toString("base64");
        }
    }
}

export default Transaction;
