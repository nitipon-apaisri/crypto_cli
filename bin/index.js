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
    const response = await fetch("http://localhost:4200/api/coins");
    const data = await response.json();
    return data.data;
};
const updateTable = async () => {
    const coins = await getCoins();
    if (table.length !== 0) table.splice(0, table.length);
    console.clear();
    await coins.data.forEach((coin) => {
        table.push([
            coin.name,
            `${Number(coin.priceUsd).toFixed(2)} USD`,
            coin.changePercent24Hr.includes("-") ? chalk.red(Number(coin.changePercent24Hr).toFixed(2)) : chalk.green(Number(coin.changePercent24Hr).toFixed(2)),
        ]);
    });
    if (hideBin(process.argv).length === 0) log(boxen("Welcome to My CLI", { padding: 1, margin: 1, borderStyle: "round" }));
    yargs(hideBin(process.argv))
        .command("coins", "show top 10 coins", () => log(table.toString()))
        .demandCommand(1)
        .parse();
};
await updateTable();
setInterval(updateTable, 5000);
