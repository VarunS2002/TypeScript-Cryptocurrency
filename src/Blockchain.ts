import Block from "./Block";
import { calculateHash } from "./utilities";
import type { Transaction } from "./utilities";

class Blockchain {
    chain: Block[];
    private genesisBlock: Block;
    private difficulty: number;
    private blockTime = 10_000;

    constructor(genesisBlock: Block, difficulty: number) {
        this.genesisBlock = genesisBlock;
        this.chain = [genesisBlock];
        this.difficulty = difficulty;
    }

    lastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    static create(difficulty: number): Blockchain {
        const genesisBlock = new Block(null, null);
        return new Blockchain(genesisBlock, difficulty);
    }

    addBlock(from: string, to: string, amount: number): void {
        const blockData: Transaction = {from, to, amount};
        const lastBlock = this.lastBlock();
        const newBlock = new Block(blockData, lastBlock.hash);
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
        this.difficulty += (Date.now() - newBlock.timestamp.getTime()) > this.blockTime ? -1 : 1;
    }

    isValid(): boolean {
        if (this.chain.length === 1) return true;
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];
            if (
                currentBlock.hash !== calculateHash(currentBlock) ||
                previousBlock.hash !== currentBlock.previousHash
            )
                return false;
        }
        return true;
    }
}

export default Blockchain;
