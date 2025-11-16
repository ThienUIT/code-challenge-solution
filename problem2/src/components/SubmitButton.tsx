import React, { memo } from 'react';

interface SubmitButtonProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = memo(({
  onSubmit,
  isSubmitting,
  disabled,
}) => {
  return (
    <button
      type="submit"
      className={`submit-button ${isSubmitting ? "loading" : ""}`}
      disabled={disabled}
      onClick={onSubmit}
    >
      {isSubmitting ? (
        <>
          <span className="spinner"></span>
          Processing...
        </>
      ) : (
        "CONFIRM SWAP"
      )}
    </button>
  );
});

SubmitButton.displayName = 'SubmitButton';
