"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/getBtcPrice.ts
var getBtcPrice_exports = {};
__export(getBtcPrice_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getBtcPrice_exports);
var handler = async (_event, _context) => {
  let priceData = void 0;
  await fetch("https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?slug=bitcoin&convert=EUR", {
    method: "GET",
    headers: {
      "X-CMC_PRO_API_KEY": "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c"
    }
  }).then((res) => {
    return res.json();
  }).then((data) => {
    priceData = {
      currentPrice: data.data.bitcoin.quote.EUR.price,
      currency: "EUR"
    };
  });
  return {
    statusCode: 200,
    body: priceData
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
