
const {ethers} = require("ethers");
const fs = require("fs");
const colors = require("colors");
var Wallet = require('ethereumjs-wallet');
const EthWallet = Wallet.default.generate();

const createWallets =async (num) => {
    var userWallets = [];
    
    for (var i = 0; i < num; i++ ){
        // var userWallet = ethers.Wallet.createRandom();
        let EthWallet = Wallet.default.generate();
        let userWallet = {
            address : EthWallet.getAddressString(),
            privateKey : EthWallet.getPrivateKeyString()
        }
        userWallets.push({address : userWallet.address, privateKey : userWallet.privateKey});
    }

    fs.writeFileSync(
		`./faucet_Tool/accounts.json`,
		JSON.stringify(userWallets, undefined, 4)
	);
}

createWallets(10000)
	.then(() => {
		console.log("complete".green);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});