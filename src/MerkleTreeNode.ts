class MerkleTreeNode {
    hash: string;
    left: MerkleTreeNode | null;
    right: MerkleTreeNode | null;

    constructor(hash: string, left: MerkleTreeNode | null, right: MerkleTreeNode | null) {
        if (!(left == null && right == null || left != null && right != null)) {
            throw new Error("A MerkleTreeNode must have either two children or none.");
        }
        this.hash = hash;
        this.left = left;
        this.right = right;
    }
}

export default MerkleTreeNode;
