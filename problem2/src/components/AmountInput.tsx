import React, { memo } from "react";
import type { Token } from "../types";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  token: Token | null;
  tokens: Token[];
  onTokenChange: (token: Token) => void;
  disabled?: boolean;
  readonly?: boolean;
  label: string;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = memo(
  ({
    amount,
    onAmountChange,
    token,
    tokens,
    onTokenChange,
    disabled = false,
    readonly = false,
    label,
    placeholder = "0.0",
  }) => {
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onAmountChange(e.target.value);
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedToken = tokens.find((t) => t.symbol === e.target.value);
      if (selectedToken) {
        onTokenChange(selectedToken);
      }
    };

    const usdValue =
      amount && token && !isNaN(Number(amount))
        ? (Number(amount) * token.price).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        : null;

    return (
      <div className="input-section">
        <div className="input-header">
          <label
            htmlFor={`amount-${token?.symbol || "token"}`}
            className="input-label"
          >
            {label}
          </label>
          {token?.balance !== undefined && (
            <span className="token-balance">
              Balance: {token.balance.toLocaleString()}
            </span>
          )}
        </div>
        <div className="input-wrapper">
          <input
            id={`amount-${token?.symbol || "token"}`}
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={placeholder}
            className={`amount-input ${readonly ? "output-input" : ""}`}
            disabled={disabled || readonly}
            readOnly={readonly}
          />
          <select
            value={token?.symbol || ""}
            onChange={handleTokenChange}
            className="token-select"
            disabled={disabled}
          >
            <option value="" disabled>
              Choose Token
            </option>
            {tokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>
                {t.symbol}
              </option>
            ))}
          </select>
          <div className="token-display">
            {token ? (
              <>
                <img
                  src={token.icon}
                  alt={token.symbol}
                  className="token-icon"
                />
                <span className="token-symbol">{token.symbol}</span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: "6px" }}
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            ) : (
              <>
                <span className="token-symbol" style={{ color: "#999" }}>
                  Choose Token
                </span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: "6px" }}
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
        {usdValue && <p className="usd-value">≈ ${usdValue}</p>}
      </div>
    );
  }
);

AmountInput.displayName = "AmountInput";
