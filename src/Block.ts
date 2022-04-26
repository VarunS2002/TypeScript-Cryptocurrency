import MerkleTree from "./MerkleTree";
import { calculateHash } from "./utilities";
import type Blockchain from "./Blockchain";
import type Transaction from "./Transaction";

class Block {
    readonly data: Transaction[];
    readonly previousHash: string | null;
    private readonly merkleTree: MerkleTree;
    readonly rootHash: string;
    hash: string | null = null;
    readonly timestamp = new Date();
    proofOfWork = 0;

    constructor(data: Transaction[], previousHash: string | null) {
        this.data = data;
        this.previousHash = previousHash;
        this.merkleTree = MerkleTree.create(data);
        this.rootHash = this.merkleTree.rootHash;
    }

    mine(difficulty: number): void {
        const regex = new RegExp(`^(0){${difficulty}}.*`);
        while (!this.hash?.match(regex)) {
            this.proofOfWork++;
            this.hash = calculateHash(this);
        }
    }

    isValid(blockChain: Blockchain): boolean {
        return this.data.every((transaction) => {
            return this.merkleTree.isValid(transaction) && transaction.isValid(blockChain);
        });
    }
}

export default Block;
