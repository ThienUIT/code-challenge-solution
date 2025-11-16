import React from "react";
import type { Token } from "../types";

interface TokenSelectorProps {
  token: Token;
  tokens: Token[];
  onTokenChange: (token: Token) => void;
  disabled?: boolean;
  label: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  token,
  tokens,
  onTokenChange,
  disabled = false,
  label,
}) => {
  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedToken = tokens.find((t) => t.symbol === e.target.value);
    if (selectedToken) {
      onTokenChange(selectedToken);
    }
  };

  return (
    <div className="token-selector">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <select
          value={token.symbol}
          onChange={handleTokenChange}
          className="token-select"
          disabled={disabled}
        >
          {tokens.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol}
            </option>
          ))}
        </select>
        <div className="token-display">
          <img src={token.icon} alt={token.symbol} className="token-icon" />
          <span className="token-symbol">{token.symbol}</span>
        </div>
      </div>
    </div>
  );
};
