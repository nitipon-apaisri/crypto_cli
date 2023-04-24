#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import boxen from "boxen";
import Table from "cli-table";
const log = console.log;
const table = new Table({
    head: ["Currency", "Price", "24 hrs Change(%)"],
    colWidths: [30, 50, 50],
});
const getCoins = async () => {
    const response = await fetch("http://localhost:4200/api/coins");
    const data = await response.json();
    return data.data;
};
const coins = await getCoins();
table.push(
    [coins.coins[0].name, `${Number(coins.coins[0].price).toFixed(2)} USD`, coins.coins[0].change],
    [coins.coins[1].name, `${Number(coins.coins[1].price).toFixed(2)} USD`, coins.coins[1].change]
);
if (hideBin(process.argv).length === 0) log(boxen("Welcome to My CLI", { padding: 1, margin: 1, borderStyle: "round" }));
yargs(hideBin(process.argv))
    .command("coins", "show top 10 coins", () => log(table.toString()))
    .demandCommand(1)
    .parse();
// log(chalk.blue("Hello world!"));
// console.log("Hello world!");
