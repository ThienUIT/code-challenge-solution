import React, { memo } from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = memo(({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zM8 4v5M8 11v1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {message}
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';
