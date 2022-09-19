# CRYPTO TRADING BOT
## Introduction

A fully automated cryptocurrency trading bot. The bot tracks cryptocurrency market data from a given source (either from crypto market tracking websites or cetralised exchanges) and make trades by conectig to a range of decentralised exchanges accross different blockchain networks.\

So far the bot can only trade on Solana through Raydium and Orca and pull market data from FTX, however, as the project develops a wider range of networks will be made available such as Ethereum through Uniswap and BSC through Pancakeswap and a wider range of data sources will be added such as Binance, Coingeko and Coinmarketcap.\

## Installation
### Download
Download the project folders and install NodeJS and NPM to run this project.\

### Set up wallet
Set up a cryptocurrency wallet on your network of choice (only solana at the moment) and add some funds. Create a folder that will contain your secret key with the given SK.json template. Add your secret key to the SK.json and save it in the folder you just created. In the config.json file add in the path to your secret key file.\

### Set up the config file
> open config.json
> Enter the desired coin pairing that you want to trade with eg. 'SOL/USD'
> Enter the time window that you want to trade in (eg. 1D, 4h, 1h, 30m, 15m, 5m) in seconds eg. 300 = 5m
> Enter the exchange data source that the bot will pull market data from eg. 'FTX'
> Enter the dex that you want the bot to trade on eg. 'raydium'
> Enter your desired strategy (so far the bot only has a simple EMA strategy)
> Add your stoploss % eg. 0.2\

### Start the bot
Open a command window to the root directory of the project and type:
```
> npm install
> npm start
```
***
## Notes
This project specifacally designed to trade cryptocurrency without the hassle of interacting with centralised exchanges that require a KYC. You give it a coin pair, give it a wallet privatekey and put it to work.\

The groundwork is layed out for users to create their own strategies and simply add the new strategy script to the strategies folder by following simple instructions with a function template... this will be released in due course...\

## Credits
This project was created by JigJug who loves to JigJuggle his shitcoins.