import MerkleTreeNode from "./MerkleTreeNode";
import { calculateHash } from "./utilities";
import type Transaction from "./Transaction";

class MerkleTree {
    root: MerkleTreeNode;
    size: number;

    constructor(root: MerkleTreeNode, size: number) {
        this.root = root;
        this.size = size;
    }

    static create(transactions: Transaction[]): MerkleTree {
        const size = Math.ceil(Math.log2(transactions.length)) + 1;
        const listOfNodes = transactions.map(
            (transaction) => new MerkleTreeNode(transaction.hash, null, null)
        );
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

    getRootHash(): string {
        return this.root.hash;
    }

    findSiblingOf(hash: string, siblingNode: MerkleTreeNode = this.root):
        { node: MerkleTreeNode, left?: boolean } | null {
        if (siblingNode.hash === hash) return { node: siblingNode };
        if (!siblingNode.left || !siblingNode.right) return null;
        if (siblingNode.left.hash === hash) return {
            node: siblingNode.right,
            left: false
        };
        if (siblingNode.right.hash === hash) return {
            node: siblingNode.left,
            left: true
        };
        return (
            this.findSiblingOf(hash, siblingNode.left) ||
            this.findSiblingOf(hash, siblingNode.right)
        );
    }

    isValid(transaction: Transaction): boolean {
        let hash = transaction.hash;
        let sibling = this.findSiblingOf(hash);
        while (sibling !== null && sibling.node.hash !== this.root.hash) {
            const concatenatedHash = sibling.left ? sibling.node.hash + hash : hash + sibling.node.hash;
            hash = calculateHash(concatenatedHash);
            sibling = this.findSiblingOf(hash);
        }
        return !!(sibling && sibling.node.hash === this.root.hash);
    }
}

export default MerkleTree;
