import { calculateHash } from "./utilities";
import type { Transaction } from "./utilities";

class Block {
    data: Transaction | null;
    previousHash: string | null;
    hash: string | null;
    timestamp: Date;
    proofOfWork: number;

    constructor(data: Transaction | null, previousHash: string | null) {
        this.data = data;
        this.hash = null;
        this.previousHash = previousHash;
        this.timestamp = new Date();
        this.proofOfWork = 0;
    }

    mine(difficulty: number): void {
        const regex = new RegExp(`^(0){${difficulty}}.*`);
        while (!this.hash?.match(regex)) {
            this.proofOfWork++;
            this.hash = calculateHash(this);
        }
    }
}

export default Block;
