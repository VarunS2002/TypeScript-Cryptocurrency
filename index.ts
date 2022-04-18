/* eslint-disable no-console */
import Blockchain from "./src/Blockchain";
import Wallet from "./src/Wallet";

const Adam = new Wallet();
const Eve = new Wallet();

const main = (): void => {
    const blockchain = Blockchain.create(Adam.publicKey);
    Adam.send(420, Eve.publicKey, blockchain);
    Adam.send(69, Eve.publicKey, blockchain);
    blockchain.mineTransaction(Eve.publicKey);
    Eve.send(143, Adam.publicKey, blockchain);
    blockchain.mineTransaction(Eve.publicKey);
    console.log("Adam has " + blockchain.getBalance(Adam.publicKey) + " coins");
    console.log("Eve has " + blockchain.getBalance(Eve.publicKey) + " coins");
    console.log(`Blockchain is${blockchain.isValid() ? "" : " not"} valid`);
};

main();
