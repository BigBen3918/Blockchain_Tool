const { ethers } = require("ethers");
require("dotenv").config();

const Accounts = require("./accounts.json");
const colors = require("colors");
const Axios = require("axios");

const { delay, toBigNum } = require("../utils");
const Provider = new ethers.providers.JsonRpcProvider(process.env.FTM_RPC);

const collectFTM = async (index) => {
    try {
        const mainWallet = new ethers.Wallet(
            Accounts[index].privateKey,
            Provider
        );

        var balance = await Provider.getBalance(Accounts[index].address);
        if (Number(balance) > ethers.utils.parseUnits("0.005")) {
            console.log(
                "index",
                index,
                "from",
                Accounts[index].address,
                "balance",
                balance
            );
            var txPromise = await mainWallet.sendTransaction({
                to: "0x2546bC5239e32b9405a73b27ceBD9042B9dFd110",
                value: balance.sub(toBigNum("0.0001", 18)),
            });
            console.log(txPromise.hash);
            return txPromise.wait();
        }
    } catch (err) {
        console.log("Transaction Error");
        // console.log(err);
    }
};

const requestFTM = (index) => {
    const requestAPI = "https://faucet.fantom.network/api/request/ftm/";
    // console.log(requestAPI + Accounts[index].address)
    var res = Axios.post(requestAPI + Accounts[index].address);
    return res;
};

const sendTransactions = async (start, end) => {
    var promise;
    // var requestNum = 0;
    var startTime = new Date().getTime();
    var count = 0;
    // try {
    //     for (var i = start; i <= end; i++) {
    //         if (count == 49) {
    //             await delay("600000");
    //             count = 0;
    //         }
    //         promise = requestFTM(i);
    //         await delay(5000);

    //         count++;
    //         i = i % end;
    //         requestNum++;
    //         var middle = new Date().getTime();
    //         var period = (middle - startTime) / 1000;
    //         console.log(
    //             "requestAPIRequest: ",
    //             requestNum,
    //             "   total Time: ",
    //             period
    //         );
    //         startTime = new Date().getTime();
    //     }
    // } catch (err) {
    //     // console.log("collect Error", err);
    //     console.log("collection Error");
    // }

    // await delay(10000);
    console.log("move start");
    try {
        for (var i = start; i < end; i++) promise = collectFTM(i);
        if (count == 999) {
            console.log("move waiting...");
            await delay("30000");
        }
        count++;
        await Promise.all([promise]).catch((err) => {
            // console.log(err);
            console.log("promise error");
        });
    } catch (err) {
        // console.log("collect Error", err);
        console.log("collect Error");
    }

    // try {
    //     for (var i = start; i < end; i++) {
    //         promise = await collectFTM(i);
    //         Promise.all(promise).catch((err) => {
    //             console.log("promise error");
    //         });
    //         i = i % end;
    //     }
    // } catch (err) {
    //     console.log("collect Error", err);
    // }

    var endTime = new Date().getTime();
    var period = (endTime - startTime) / 1000;

    console.log(" total Time : ", period);
};;

const start = () => {
    sendTransactions(0, 9999);
};

start();
