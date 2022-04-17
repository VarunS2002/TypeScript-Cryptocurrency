import MerkleTree from "./MerkleTree";
import { calculateHash } from "./utilities";
import type Blockchain from "./Blockchain";
import type Transaction from "./Transaction";

class Block {
    data: Transaction[];
    previousHash: string | null;
    rootHash: string;
    hash: string | null = null;
    timestamp = new Date();
    proofOfWork = 0;

    constructor(data: Transaction[], previousHash: string | null) {
        this.data = data;
        this.previousHash = previousHash;
        this.rootHash = MerkleTree.create(data).getRootHash();
    }

    mine(difficulty: number): void {
        const regex = new RegExp(`^(0){${difficulty}}.*`);
        while (!this.hash?.match(regex)) {
            this.proofOfWork++;
            this.hash = calculateHash(this);
        }
    }

    isValid(blockChain: Blockchain): boolean {
        return this.data.every((transaction) => transaction.isValid(blockChain));
    }
}

export default Block;
