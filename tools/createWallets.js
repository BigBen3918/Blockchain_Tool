
const {ethers} = require("ethers");
const fs = require("fs");
const colors = require("colors");
var Wallet = require('ethereumjs-wallet');
const EthWallet = Wallet.default.generate();

const createWallets =async (num) => {
    var userWallets = [];
    
    const lucky = "0x123456789";
    let luckyNum = 0;

    for (var i = 0; i < num; i++ ){
        // var userWallet = ethers.Wallet.createRandom();
        let EthWallet = Wallet.default.generate();
        let userWallet = {
            address : EthWallet.getAddressString(),
            privateKey : EthWallet.getPrivateKeyString()
        }

        if( i % 100000 == 0) 
            console.log("address: " + EthWallet.getAddressString());
        if(lucky.slice(0,7) == userWallet.address.slice(0,7)) {
            userWallets.push({address : userWallet.address, privateKey : userWallet.privateKey});
            console.log("address : ", userWallet.address.blue, "privateKey", userWallet.privateKey );
            luckyNum ++;
            if(luckyNum>10) break;
        }
    }

    fs.writeFileSync(
		`./walletData/accounts.json`,
		JSON.stringify(userWallets, undefined, 4)
	);
}

createWallets(10000000)
	.then(() => {
		console.log("complete".green);
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});