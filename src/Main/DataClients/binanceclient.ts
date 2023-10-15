const { WebsocketAPI } = require('@binance/connector')
import { Console } from "console"
const logger = new Console({ stdout: process.stdout, stderr: process.stderr })

// callbacks for different events
const callbacks = {
  open: (client: any) => {
    logger.debug('Connected with Websocket server')
    // send message to get orderbook info after connection open
    //client.orderbook('BTCUSDT')
    //client.orderbook('BNBUSDT', { limit: 10 })
    client.ticker({symbol: 'SOLUSDT'})
    client.avgPrice('SOLUSDT')
    client.ticker24hr({symbol: 'SOLUSDT'})
  },
  close: () => logger.debug('Disconnected with Websocket server'),
  message: (data:any) => logger.info(JSON.parse(data))
}

const websocketAPIClient = new WebsocketAPI(null, null, { logger, callbacks })

// disconnect the connection
setTimeout(() => websocketAPIClient.disconnect(), 20000)