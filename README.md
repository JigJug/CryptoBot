# CRYPTO TRADING BOT
## Introduction
***
A fully automated cryptocurrency trading bot. The bot tracks cryptocurrency market data from a given source (either from crypto market tracking websites or cetralised exchanges) and make trades by conectig to a range of decentralised exchanges accross different blockchain networks.
This bot is specifacally designed to trade cryptocurrency without the hassle of interacting with centralised exchanges that require a KYC. You give it a coin pair, give it a wallet key and put it to work.
***
***
So far the bot can only trade on Solana through Raydium and Orca and pull market data from FTX, however, as the project develops a wider range of networks will be made available such as Ethereum through Uniswap and BSC through Pancakeswap and a wider range of data sources will be added such as Binance, Coingeko and Coinmarketcap.
***
***
## Installation
***
Download the project folders and install NodeJS and NPM to run this project.
***
***
Set up a cryptocurrency wallet on your network of choice (only solana at the moment) and add some funds. Create a folder that will contain your secret key with the given SK.json template. Add your secret key to the SK.json and save it in the folder you just created. In the config.json file add in the path to your secret key file.
***
***
Set up the config.json. Enter the desired coin pairing that you want to trade with, the time window that you want to trade in (eg. 1D, 4h, 1h, 30m, 15m, 5m), the exchange data source that the bot will pull market data from, the dex that you want the bot to trade on, your desired strategy (so far the bot only has a simple EMA strategy), and your stoploss %.
***
***
Open a command window to the root directory of the project and type 'npm start'.
***
***
This project lays the groundwork for users to create their own strategies and simply add the script to the strategies folder by following simple instructions with a function template which will be released in due course.
***