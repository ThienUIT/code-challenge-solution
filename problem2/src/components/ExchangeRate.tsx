import React, { memo } from "react";
import type { Token } from "../types";

interface ExchangeRateProps {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  exchangeRate: number;
  error?: string;
}

export const ExchangeRate: React.FC<ExchangeRateProps> = memo(
  ({ fromToken, toToken, fromAmount, toAmount, exchangeRate, error }) => {
    if (!fromToken || !toToken || !fromAmount || !toAmount || error) {
      return null;
    }

    return (
      <div className="rate-info">
        <p className="rate-text">
          1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
        </p>
        <p className="rate-subtext">
          Rate: ${fromToken.price.toLocaleString()} / $
          {toToken.price.toLocaleString()}
        </p>
      </div>
    );
  }
);

ExchangeRate.displayName = "ExchangeRate";
