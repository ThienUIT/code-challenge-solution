import React, { memo } from 'react';

interface SwapButtonProps {
  onSwap: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = memo(({
  onSwap,
  isLoading,
  disabled = false,
}) => {
  return (
    <div className="swap-icon-container">
      <button
        type="button"
        onClick={onSwap}
        className={`swap-icon-button ${isLoading ? "rotating" : ""}`}
        disabled={disabled}
        aria-label="Swap currencies"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 14L12 9L7 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
});

SwapButton.displayName = 'SwapButton';
