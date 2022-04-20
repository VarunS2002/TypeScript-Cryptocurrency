import Block from "./Block";
import NetworkWallet from "./NetworkWallet";
import Transaction from "./Transaction";
import { calculateHash } from "./utilities";

class Blockchain {
    chain: Block[];
    difficulty: number;
    blockTime = 10_000;
    transactions: Transaction[] = [];
    reward = 420;

    constructor(chain: Block[], difficulty: number) {
        this.chain = chain;
        this.difficulty = difficulty;
    }

    static create(firstUserAddress: string): Blockchain {
        const firstTransaction = new Transaction(
            NetworkWallet.publicKey,
            firstUserAddress,
            10000
        );
        firstTransaction.sign(NetworkWallet);
        const genesisBlock = new Block([firstTransaction], null);
        genesisBlock.mine(3);
        return new Blockchain([genesisBlock], 3);
    }

    addBlock(transactions: Transaction[]): void {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = new Block(transactions, lastBlock.hash);
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
        this.difficulty += (Date.now() - newBlock.timestamp.getTime()) > this.blockTime ? -1 : 1;
    }

    isValid(): boolean {
        if (this.chain[0].hash !== calculateHash(this.chain[0]) || !this.chain[0].isValid(this)) {
            return false;
        }
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];
            if (
                currentBlock.hash !== calculateHash(currentBlock) ||
                previousBlock.hash !== currentBlock.previousHash ||
                !currentBlock.isValid(this)
            ) {
                return false;
            }
        }
        return true;
    }

    addTransaction(transaction: Transaction): void {
        const isDuplicate = this.transactions.some(({ hash }) => hash === transaction.hash);
        if (!isDuplicate && transaction.isValid(this)) {
            this.transactions.push(transaction);
        }
    }

    getBalance(userPublicKey: string): number {
        let balance = 0;
        this.chain.forEach((block) => {
            block.data.forEach((transaction) => {
                if (transaction.senderPublicKey === userPublicKey) {
                    balance -= transaction.amount;
                }
                if (transaction.receiverPublicKey === userPublicKey) {
                    balance += transaction.amount;
                }
            });
        });
        return balance;
    }

    mineTransaction(rewardAddress: string): void {
        const rewardTransaction = new Transaction(
            NetworkWallet.publicKey,
            rewardAddress,
            this.reward
        );
        rewardTransaction.sign(NetworkWallet);
        this.addBlock([rewardTransaction, ...this.transactions]);
        this.transactions = [];
    }
}

export default Blockchain;
