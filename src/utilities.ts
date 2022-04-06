import { createHash } from "crypto";
import Block from "./Block";

type Transaction = {
    from: string;
    to: string;
    amount: number;
};

const calculateHash = (block: Block): string => {
    const data = JSON.stringify(block.data);
    const blockData =
        data +
        block.previousHash +
        block.timestamp.toISOString() +
        block.proofOfWork.toString();

    return createHash("sha256").update(blockData).digest("hex");
};

export { calculateHash };
export type { Transaction };
