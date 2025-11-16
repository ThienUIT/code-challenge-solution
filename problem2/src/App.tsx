import "./App.css";
import { useSwap } from "./hooks/useSwap";
import { AmountInput } from "./components/AmountInput";
import { SwapButton } from "./components/SwapButton";
import { ExchangeRate } from "./components/ExchangeRate";
import { ErrorMessage } from "./components/ErrorMessage";
import { SubmitButton } from "./components/SubmitButton";
import { Footer } from "./components/Footer";
import { TokenType } from "./types";

function App() {
  const {
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
  } = useSwap();

  if (tokensLoading) {
    return (
      <div className="app">
        <div className="swap-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading tokens...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="swap-container">
        <form onSubmit={handleSubmit} className="swap-form">
          <h2 className="swap-title">Swap</h2>

          <AmountInput
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            token={fromToken}
            tokens={availableFromTokens}
            onTokenChange={(token) =>
              handleTokenSelection(token, TokenType.FROM)
            }
            disabled={isSubmitting}
            label="Amount to send"
            placeholder="0.0"
          />

          <SwapButton
            onSwap={handleSwapTokens}
            isLoading={isLoading}
            disabled={isSubmitting || !fromToken || !toToken}
          />

          <AmountInput
            amount={toAmount}
            onAmountChange={() => {}}
            token={toToken}
            tokens={availableToTokens}
            onTokenChange={(token) => handleTokenSelection(token, TokenType.TO)}
            readonly={true}
            label="Amount to receive"
            placeholder="0.0"
          />

          <ExchangeRate
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={fromAmount}
            toAmount={toAmount}
            exchangeRate={exchangeRate}
            error={error}
          />

          <ErrorMessage message={error} />

          <SubmitButton
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={
              !fromAmount || !!error || isSubmitting || !fromToken || !toToken
            }
          />
        </form>

        <Footer />
      </div>
    </div>
  );
}

export default App;
