import { createHash } from "crypto";
import Block from "./Block";

const calculateHash = (dataToHash: Block | string): string => {
    let stringData: string;
    if (dataToHash instanceof Block) {
        stringData =
            dataToHash.rootHash +
            dataToHash.previousHash +
            dataToHash.timestamp.toISOString() +
            dataToHash.proofOfWork.toString();
    } else {
        stringData = dataToHash;
    }
    return createHash("sha256").update(stringData).digest("hex");
};

export { calculateHash };
