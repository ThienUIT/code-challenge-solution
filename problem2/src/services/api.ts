import type { Token, ApiResponse, PriceData } from "../types";

const TOKEN_API_URL = "https://interview.switcheo.com/prices.json";
// Base URL for the raw token icons on GitHub
const TOKEN_ICON_BASE_URL = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const iconNameOverrides: Record<string, string> = {
  "HDN": "HDN.png",
  "WMON": "WMON.png",
  // --- Symbol-to-filename mismatches ---
  "LSI": "Liquid Staking Index.svg",
  "STEVMOS": "stEVMOS.svg",
  "RATOM": "rATOM.svg",
  "STATOM": "stATOM.svg",
  "STLUNA": "stLUNA.svg",
  "STOSMO": "stOSMO.svg",
};

export const tokenApi = {
  async fetchTokens(): Promise<ApiResponse<Token[]>> {
    try {
      const response = await fetch(TOKEN_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData = await response.json() as PriceData[];

      const tokenMap = new Map<string, { price: number; date: string }>();

      for (const item of priceData) {
        if (
          !tokenMap.has(item.currency) ||
          new Date(item.date) > new Date(tokenMap.get(item.currency)!.date)
        ) {
          tokenMap.set(item.currency, { price: item.price, date: item.date });
        }
      };

      const getTokenIconUrl = (symbol: string): string => {
        if (iconNameOverrides[symbol]) {
          const fileName = iconNameOverrides[symbol].replace(/ /g, '%20');
          return `${TOKEN_ICON_BASE_URL}${fileName}`;
        }
        const fileName = `${encodeURIComponent(symbol)}.svg`;
        return `${TOKEN_ICON_BASE_URL}${fileName}`;
      };

      const tokens: Token[] = [];
      for (const [symbol, data] of tokenMap) {
        if (data.price && data.price > 0) {
          tokens.push({
            symbol,
            name: symbol,
            icon: getTokenIconUrl(symbol),
            price: data.price,
          });
        }
      };

      return {
        data: tokens,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching tokens:", error);
      return {
        data: [],
        success: false,
        error: "Failed to fetch token prices",
      };
    }
  },

  async fetchTokenPrice(symbol: string): Promise<ApiResponse<number>> {
    try {
      const response = await fetch(TOKEN_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData = await response.json() as PriceData[];

      let latestPrice = 0;
      let latestDate = "";

      for (const item of priceData) {
        if (item.currency === symbol) {
          if (!latestDate || new Date(item.date) > new Date(latestDate)) {
            latestPrice = item.price;
            latestDate = item.date;
          }
        }
      }

      if (latestPrice === 0) {
        return {
          data: 0,
          success: false,
          error: `Token ${symbol} not found`,
        };
      }

      return {
        data: latestPrice,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching token price:", error);
      return {
        data: 0,
        success: false,
        error: "Failed to fetch token price",
      };
    }
  },

  async executeSwap(
    fromToken: string,
    toToken: string,
    amount: number
  ): Promise<ApiResponse<{ txHash: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.error("Swapped tokens:", fromToken, toToken, amount);

    return {
      data: {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
      success: true,
    };
  },
};
