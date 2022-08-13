"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const OffChainAggregatorABI_json_1 = __importDefault(require("./abis/OffChainAggregatorABI.json"));
const { webSocket, divisor, eventAnswer, networkNumber } = require("./config.js");
let contracts = {
    USDT: "0x3011e9d73e9b01a593da032f41626e6bbe9e408d",
    USDC: "0xf9c53A834F60cBbE40E27702276fBc0819B3aFAD",
    BUSD: "0xB2e3EEd25825E8c3946e403B8E8D943976E484E4",
    DAI: "0x62439095489Eb5dE4572de632248682c09a05Ad4",
    TUSD: "0x2343C7E237ECB888B5400277863178388Dcc84f5",
    FRAX: "0x1e4662eAD79B60F9307802F323431949bf6e5b8e"
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new ethers_1.ethers.providers.WebSocketProvider(webSocket, networkNumber);
        let contractAddresses = Object.values(contracts);
        for (let key of contractAddresses.keys()) {
            showPrice(contractAddresses, client, key);
        }
    });
}
function showPrice(contractAddresses, client, i) {
    return __awaiter(this, void 0, void 0, function* () {
        const aggregator = new ethers_1.ethers.Contract(contractAddresses[i], OffChainAggregatorABI_json_1.default, client);
        aggregator.on(eventAnswer, (currentPrice, roundId, updatedAt, txData) => {
            const tokenName = Object.keys(contracts).find((key) => {
                return contracts[key] === aggregator.address;
            });
            console.log(tokenName, 'Price', JSON.parse(currentPrice) / divisor);
        });
    });
}
main();
