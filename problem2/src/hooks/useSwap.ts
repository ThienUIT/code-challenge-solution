import { useCallback, useEffect, useMemo, useState } from "react";
import { tokenApi } from "../services/api";
import type { Token } from "../types";
import { TokenType } from "../types";

const mockUserTokenBalances: Array<{
  symbol: string;
  balance: number;
}> = [
  { symbol: "BLUR", balance: 125.5 },
  { symbol: "bNEO", balance: 45.25 },
  { symbol: "BUSD", balance: 1000.0 },
  { symbol: "USD", balance: 5000.0 },
  { symbol: "ETH", balance: 2.5 },
  { symbol: "GMX", balance: 10.75 },
  { symbol: "STEVMOS", balance: 500.0 },
  { symbol: "LUNA", balance: 150.3 },
  { symbol: "RATOM", balance: 75.0 },
  { symbol: "STRD", balance: 200.0 },
  { symbol: "EVMOS", balance: 300.5 },
  { symbol: "IBCX", balance: 50.0 },
  { symbol: "IRIS", balance: 100.0 },
  { symbol: "ampLUNA", balance: 120.0 },
  { symbol: "KUJI", balance: 1500.0 },
  { symbol: "STOSMO", balance: 250.0 },
  { symbol: "USDC", balance: 10000.0 },
  { symbol: "axlUSDC", balance: 5000.0 },
  { symbol: "ATOM", balance: 100.0 },
  { symbol: "STATOM", balance: 50.0 },
  { symbol: "OSMO", balance: 1000.0 },
  { symbol: "rSWTH", balance: 25000.0 },
  { symbol: "STLUNA", balance: 140.0 },
  { symbol: "LSI", balance: 30.0 },
  { symbol: "OKB", balance: 200.0 },
  { symbol: "OKT", balance: 100.0 },
  { symbol: "SWTH", balance: 50000.0 },
  { symbol: "USC", balance: 1200.0 },
  { symbol: "WBTC", balance: 0.5 },
  { symbol: "wstETH", balance: 3.0 },
  { symbol: "YieldUSD", balance: 750.0 },
  { symbol: "ZIL", balance: 2000.0 },
];

export const useSwap = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokensLoading, setTokensLoading] = useState(true);

  const isValidNumberFormat = (value: string): boolean => {
    return /^\d*\.?\d*$/.test(value);
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setTokensLoading(true);

        const response = await tokenApi.fetchTokens();

        if (response.success) {
          setTokens(response.data);

          const mockUserTokens: Token[] = response.data
            .map((token) => {
              const balanceData = mockUserTokenBalances.find(
                (mock) => mock.symbol === token.symbol
              );
              return {
                ...token,
                balance: balanceData?.balance,
              };
            });

          setUserTokens(mockUserTokens);
        } else {
          setError("Failed to load tokens");
        }
      } catch (err) {
        setError("Failed to load tokens");
      } finally {
        setTokensLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const availableFromTokens = useMemo(() => {
    return userTokens;
  }, [userTokens]);

  const availableToTokens = useMemo(() => {
    if (!fromToken) return userTokens;
    return userTokens.filter((token) => token.symbol !== fromToken.symbol);
  }, [userTokens, fromToken]);

  const exchangeRate = useMemo(() => {
    if (fromToken && toToken) {
      return fromToken.price / toToken.price;
    }
    return 0;
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const amount = Number(fromAmount);

      if (
        fromToken &&
        fromToken.balance !== undefined &&
        amount > fromToken.balance
      ) {
        setError(
          `Insufficient balance. Maximum: ${fromToken.balance.toLocaleString()} ${
            fromToken.symbol
          }`
        );
        setToAmount("");
        return;
      }

      const result = (amount * exchangeRate).toFixed(4);
      setToAmount(result);
      setError("");
    } else if (fromAmount === "") {
      setToAmount("");
      setError("");
    }
  }, [fromAmount, exchangeRate, fromToken]);

  const handleFromAmountChange = useCallback((value: string) => {
    if (value === "") {
      setFromAmount("");
      setToAmount("");
      setError("");
      return;
    }

    if (isValidNumberFormat(value)) {
      setFromAmount(value);
    }
  }, []);

  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    setIsLoading(true);

    setTimeout(() => {
      const tempToken = fromToken;

      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount);

      if (toAmount && !isNaN(Number(toAmount))) {
        const rate = toToken.price / tempToken.price;
        const result = (Number(toAmount) * rate).toFixed(4);
        setFromAmount(toAmount);
        setToAmount(result);
      }

      setIsLoading(false);
    }, 300);
  }, [fromToken, toToken, toAmount]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!fromToken || !toToken || !fromAmount || Number(fromAmount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      if (fromToken.symbol === toToken.symbol) {
        setError("Cannot swap the same currency");
        return;
      }

      setError("");
      setIsSubmitting(true);

      try {
        const response = await tokenApi.executeSwap(
          fromToken.symbol,
          toToken.symbol,
          Number(fromAmount)
        );

        if (response.success) {
          alert(
            `Swap successful!\n\nYou swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}\nTransaction: ${response.data.txHash}`
          );

          setFromAmount("");
          setToAmount("");
        } else {
          setError(response.error || "Swap failed");
        }
      } catch (err) {
        setError("Swap failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fromToken, toToken, fromAmount, toAmount]
  );

  const handleTokenSelection = useCallback(
    (token: Token, type: TokenType) => {
      if (type === TokenType.FROM) {
        setFromToken(token);
        if (toToken && token.symbol === toToken.symbol) {
          setToToken(null);
        }
      } else {
        setToToken(token);
      }
    },
    [toToken]
  );

  return {
    tokens,
    userTokens,
    availableFromTokens,
    availableToTokens,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    exchangeRate,
    isLoading,
    error,
    isSubmitting,
    tokensLoading,
    handleFromAmountChange,
    handleSwapTokens,
    handleSubmit,
    handleTokenSelection,
  };
};
