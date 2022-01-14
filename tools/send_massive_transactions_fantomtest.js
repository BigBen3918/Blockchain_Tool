
const {ethers} = require("ethers");
require('dotenv').config();
const Accounts = require("../walletData/accounts.json");
const colors = require("colors");

const Provider = new ethers.providers.JsonRpcProvider(process.env.FTM_RPC);

const sendMassiveTransactions = async (amount,index,max) => {
    const mainWallet = new ethers.Wallet(Accounts[index].privateKey,Provider);
    var coinAmount = ethers.utils.parseEther(amount);
    var txNum = 0;
    
    var nonce = await Provider.getTransactionCount(mainWallet.address);
    var start = new Date().getTime();

    var txPromises = [];
    var conformPromises = [];
    //start transactions
    for (var i = 0; i < max; i++){
        let account = Accounts[0];
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

    var lastTx = txPromises[txPromises.length-1];
    await Promise.all([lastTx]).then((txs)=>{
        txs.map((tx,i)=>{
            console.log(i,tx.hash.blue);
            conformPromises.push(tx.wait())
        })
    })

    var lastTransaction = conformPromises[conformPromises.length-1];
    await Promise.all([lastTransaction]);
    var end = new Date().getTime();
    var period = (end - start)/1000;
    console.log(" total Time : ",period);
    console.log(" total Tx : ", txNum, " average : ", period/txNum);
}

const sendTransactions = (start,end,txNum)=>{
    for(var i = start; i < end ; i++)
    sendMassiveTransactions("0.0000001",i,txNum)
    .then(() => {
        console.log("complete".green);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

sendTransactions(1,10,10);