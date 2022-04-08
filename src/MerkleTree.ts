import MerkleTreeNode from "./MerkleTreeNode";
import { calculateHash } from "./utilities";
import type { Transaction } from "./utilities";

class MerkleTree {
    private root: MerkleTreeNode;
    private size: number;

    constructor(root: MerkleTreeNode, size: number) {
        this.root = root;
        this.size = size;
    }

    static create(transactions: Transaction[]): MerkleTree {
        const size = Math.ceil(Math.log2(transactions.length)) + 1;
        const listOfNodes = transactions.map((transaction) => {
            const nodeHash = calculateHash(transaction);
            return new MerkleTreeNode(nodeHash, null, null);
        });
        const root = MerkleTree.constructMerkleTreeRoot(listOfNodes);
        return new MerkleTree(root, size);
    }

    private static constructMerkleTreeRoot(merkleTreeNodes: MerkleTreeNode[]): MerkleTreeNode {
        const length = merkleTreeNodes.length;
        if (length === 1) return merkleTreeNodes[0];
        const listOfNodes: MerkleTreeNode[] = [];
        for (let i = 0; i < length; i += 2) {
            const currentNode = merkleTreeNodes[i];
            if (i + 1 >= length) {
                listOfNodes.push(currentNode);
                break;
            }
            const nextItem = merkleTreeNodes[i + 1];
            const concatenatedHash = currentNode.hash + nextItem.hash;
            listOfNodes.push(new MerkleTreeNode(calculateHash(concatenatedHash), currentNode, nextItem));
        }
        return this.constructMerkleTreeRoot(listOfNodes);
    }
}

export default MerkleTree;
