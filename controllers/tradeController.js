import asyncHandler from "express-async-handler";
import ccxt from "ccxt";
import { trade } from "../services/Trade";

let interval;

const initTrade = asyncHandler(async (req, res) => {
  const { asset, base, allocation = 0.2, spread = 0.2 } = res.data;
  const config = {
    asset,
    assetName,
    base,
    baseName,
    allocation,
    spread,
    tickInterval: 2000, // Duration between each tick, in milliseconds
  };
  const binanceClient = new ccxt.binance({
    apiKey: process.env.API_KEY,
    secret: process.env.API_SECRET,
  });
  trade(config, binanceClient);
  interval = setInterval(tick, config.tickInterval, config, binanceClient);
});

const stopTrade = asyncHandler(() => {
  clearInterval(interval);
});

export { initTrade, stopTrade };
