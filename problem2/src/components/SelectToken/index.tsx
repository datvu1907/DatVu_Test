import { Loader2 } from "lucide-react";
import { CryptoCurrency } from '../../models/CryptoCurrency'; // Adjust the import path as needed

type TokenSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  amount: string;
  isLoading: boolean;
  isPriceLoading: boolean;
  tokens: CryptoCurrency[];
  handleSellAmountChange?: (value: string) => void;
};

const TokenSelect = ({
  value,
  onChange,
  label,
  amount,
  isLoading,
  isPriceLoading,
  tokens,
  handleSellAmountChange,
}: TokenSelectProps) => {
  const getTokenIcon = (currency: string) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-4 mb-2">
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={amount}
            onChange={(e) => label === "Sell" && handleSellAmountChange ? handleSellAmountChange(e.target.value) : null}
            placeholder="0"
            className="bg-transparent text-4xl text-white outline-none w-full"
            disabled={label !== "Sell" || isLoading}
          />
          {isPriceLoading && label === "Buy" && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-4">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            </div>
          )}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-gray-800 text-white pl-3 pr-8 py-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        >
          <option value="">Select token</option>
          {tokens.map((token) => (
            <option key={token.currency} value={token.currency} className="flex items-center gap-2">
              {token.currency}
            </option>
          ))}
        </select>
      </div>
      {value && (
        <div className="flex items-center gap-2 mt-2">
          <img
            src={getTokenIcon(value)}
            alt={value}
            className="w-5 h-5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-gray-400 text-sm">
            ${tokens.find(t => t.currency === value)?.price.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TokenSelect;