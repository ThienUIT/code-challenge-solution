import React, { useMemo } from "react";
import { BoxProps } from "./interface/Box";
import WalletRow from "./WalletRow";
import classes from "./WalletPage.module.css";

declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps { }

enum Priority {
  Unknown = -99,
}

const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain?: string): number =>
  blockchain && PRIORITY_MAP[blockchain] !== undefined
    ? PRIORITY_MAP[blockchain]
    : Priority.Unknown;

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(value);
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;

  const balances: WalletBalance[] = useWalletBalances();
  const prices: { [key: string]: number } = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    const visible = balances.filter((balance) => {
      const priority = getPriority(balance.blockchain);
      if (priority === Priority.Unknown) return false;
      if (balance.amount <= 0) return false;
      return true;
    });

    // Map to include formatted string and usdValue
    const mapped = visible.map((balance) => {
      const price = prices?.[balance.currency] ?? 0;
      const usdValue = balance.amount * price;

      const formatted = formatNumber(balance.amount);
      return { ...balance, formatted, usdValue };
    });

    // Sort by priority descending, then by usdValue desc as tiebreaker, then currency
    mapped.sort((lhs, rhs) => {
      const lp = getPriority(lhs.blockchain);
      const rp = getPriority(rhs.blockchain);
      if (lp > rp) return -1;
      if (lp < rp) return 1;

      // same priority -> sort by usdValue desc
      if (lhs.usdValue > rhs.usdValue) return -1;
      if (lhs.usdValue < rhs.usdValue) return 1;

      // final deterministic fallback
      return lhs.currency.localeCompare(rhs.currency);
    });

    return mapped;
  }, [balances, prices]);

  if(formattedBalances.length === 0){
    return <div {...rest} className={classes.empty}>No assets found.</div>;
  }

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const key = `${balance.currency}-${balance.blockchain}`;

    return (
      <WalletRow
        key={key}
        className={classes.row}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;
