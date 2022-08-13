import { ethers } from "ethers";
import  OffChainAggregatorABI  from "./abis/OffChainAggregatorABI.json";

const { webSocket, divisor, eventAnswer, networkNumber } = require("./config.js");
let contracts = {
    USDT: "0x3011e9d73e9b01a593da032f41626e6bbe9e408d",
    USDC: "0xf9c53A834F60cBbE40E27702276fBc0819B3aFAD",
    BUSD: "0xB2e3EEd25825E8c3946e403B8E8D943976E484E4",
    DAI: "0x62439095489Eb5dE4572de632248682c09a05Ad4",
    TUSD: "0x2343C7E237ECB888B5400277863178388Dcc84f5",
    FRAX: "0x1e4662eAD79B60F9307802F323431949bf6e5b8e"
}

async function main() {
    const client = new ethers.providers.WebSocketProvider(
        webSocket,
        networkNumber
    );

    let contractAddresses = Object.values(contracts)
    for (let key of contractAddresses.keys()) {
        showPrice(contractAddresses, client, key);
    }
}

async function showPrice(contractAddresses: any, client: any, i: any) {
    const aggregator = new ethers.Contract(
        contractAddresses[i], 
        OffChainAggregatorABI,
        client
    );
    aggregator.on(eventAnswer, (currentPrice, roundId, updatedAt, txData) => {
        const tokenName = (Object.keys(contracts) as (keyof typeof contracts)[]).find((key) => {
            return contracts[key] === aggregator.address;
          });    
        console.log(tokenName,'Price',JSON.parse(currentPrice) / divisor)
    });
}

main();