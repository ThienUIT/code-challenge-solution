export interface Token {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  balance?: number;
}

export interface SwapFormData {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export const TokenType = {
  FROM: "from",
  TO: "to",
} as const;

export type TokenType = (typeof TokenType)[keyof typeof TokenType];

export interface PriceData {
  currency: string;
  price: number;
  date: string;
}