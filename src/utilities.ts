import { createHash } from "crypto";
import Block from "./Block";

type Transaction = {
    from: string;
    to: string;
    amount: number;
};

const calculateHash = (dataToHash: string | Transaction | Block): string => {
    let stringData: string;
    if (dataToHash instanceof Block) {
        stringData =
            JSON.stringify(dataToHash.data) +
            dataToHash.previousHash +
            dataToHash.timestamp.toISOString() +
            dataToHash.proofOfWork.toString();
    } else if (typeof dataToHash === "string") {
        stringData = dataToHash;
    } else {
        stringData = JSON.stringify(dataToHash);
    }
    return createHash("sha256").update(stringData).digest("hex");
};

export { calculateHash };
export type { Transaction };
