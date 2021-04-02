import colors from "colors";
import axios from "axios";

/**
 * @desc function is a timeHandler
 * */
const trade = async (config, binanceClient) => {
  const { asset, assetName, base, baseName, spread, allocation } = config;
  const market = `${asset}/${base}`;

  // Cancel open orders left from previous tick, if any
  const orders = await binanceClient.fetchOpenOrders(market);
  orders.forEach(async (order) => {
    await binanceClient.cancelOrder(order.id);
  });

  // Fetch current market prices
  const results = await Promise.all([
    axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${assetName}&vs_currencies=usd`
    ),
    axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${baseName}&vs_currencies=usd`
    ),
  ]);
  const marketPrice =
    results[0].data[assetName].usd / results[1].data[baseName].usd;

  // Calculate new orders parameters
  const sellPrice = marketPrice * (1 + spread);
  const buyPrice = marketPrice * (1 - spread);
  const balances = await binanceClient.fetchBalance();
  const assetBalance = balances.free[asset]; // e.g. 0.01 BTC
  const baseBalance = balances.free[base]; // e.g. 20 USDT
  const sellVolume = assetBalance * allocation;
  const buyVolume = (baseBalance * allocation) / marketPrice;

  //Send orders
  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);
  await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);

  console.log(
    `
        New tick for ${market}...
        Created limit sell order for ${sellVolume}@${sellPrice}`.red.bold,
    `Created limit buy order for ${buyVolume}@${buyPrice}`.green.bold
  );
};

export { trade };
