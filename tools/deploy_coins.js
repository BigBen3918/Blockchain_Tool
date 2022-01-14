
const {ethers} = require("ethers");
require('dotenv').config();
const Accounts = require("../walletData/accounts.json");
const colors = require("colors");

const Provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const mainWallet = new ethers.Wallet(process.env.PRIVATEKEY,Provider);

const deploy_coins = async (amount) => {
    var coinAmount = ethers.utils.parseEther(amount);
    var txNum = 0;
    
    var nonce = await Provider.getTransactionCount(mainWallet.address);
    var start = new Date().getTime();

    var txPromises = [];
    var conformPromises = [];
    //start transactions
    for (var i = 0; i < Accounts.length; i++){
        let account = Accounts[i];
        var txPromise = mainWallet.sendTransaction(
            {
                to : account.address,  
                value : coinAmount,
                nonce : nonce++
            }
        );
        txNum++;
        txPromises.push(txPromise);
    };

    await Promise.all(txPromises).then((txs)=>{
        txs.map((tx,i)=>{
            console.log(i,tx.hash.blue);
            conformPromises.push(tx.wait())
        })
    })

    await Promise.all(conformPromises);
    var end = new Date().getTime();
    var period = (end - start)/1000;
    console.log(" total Time : ",period);
    console.log(" total Tx : ", txNum, " average : ", period/txNum);
}

deploy_coins("0.01")
    .then(() => {
        console.log("complete".green);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });