#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import boxen from "boxen";
import Table from "cli-table3";
const log = console.log;
const table = new Table({
    head: [chalk.cyan.bold("Currency"), chalk.cyan.bold("Price"), chalk.cyan.bold("24 hrs Change(%)")],
    colWidths: [20, 20, 20],
});

const getCoins = async () => {
    const response = await fetch("https://crypto-cli.onrender.com/api/coins");
    const data = await response.json();
    return data.data;
};
const getCoinById = async (coin) => {
    const response = await fetch(`https://crypto-cli.onrender.com/api/coin/${coin}`);
    const data = await response.json();
    return data.data;
};
const getCoinByIds = async (coins) => {
    const response = await fetch(`https://crypto-cli.onrender.com/api/coins/${coins}`);
    const data = await response.json();
    return data.data;
};
const updateTable = async (data) => {
    if (table.length !== 0) table.splice(0, table.length);
    console.clear();
    if (Array.isArray(data.data)) {
        data.data.forEach((coin) => {
            table.push([
                coin.name,
                `${Number(coin.priceUsd).toFixed(2)} USD`,
                coin.changePercent24Hr.includes("-") ? chalk.red(Number(coin.changePercent24Hr).toFixed(2)) : chalk.green(Number(coin.changePercent24Hr).toFixed(2)),
            ]);
        });
    } else {
        table.push([
            data.data.name,
            `${Number(data.data.priceUsd).toFixed(2)} USD`,
            data.data.changePercent24Hr.includes("-") ? chalk.red(Number(data.data.changePercent24Hr).toFixed(2)) : chalk.green(Number(data.data.changePercent24Hr).toFixed(2)),
        ]);
    }
    log(table.toString());
};
if (hideBin(process.argv).length === 0) log(boxen("Welcome to My CLI", { padding: 1, margin: 1, borderStyle: "round" }));
yargs(hideBin(process.argv))
    .command("top", "show top 10 coins", async () => {
        await updateTable(await getCoins());
        setInterval(async () => updateTable(await getCoins()), 5000);
    })
    .command("coins <coin>", "show coin(s) by name(s) e.g Bitcoin Ethereum", async (yargs) => {
        try {
            const coins = yargs.argv._.slice(1);
            if (coins.length > 1) {
                await updateTable(await getCoinByIds(coins.toString()));
                setInterval(async () => updateTable(await getCoinByIds(coins)), 5000);
            } else {
                await updateTable(await getCoinById(coins[0]));
                setInterval(async () => updateTable(await getCoinById(coins[0])), 5000);
            }
        } catch (error) {
            console.log(error);
        }
    })
    .demandCommand(1)
    .parse();
