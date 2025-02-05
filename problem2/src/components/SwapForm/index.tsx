import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { CryptoCurrency } from "../../models/CryptoCurrency";
import TokenSelect from "../SelectToken";


const CurrencySwapForm = () => {
  const [tokens, setTokens] = useState<CryptoCurrency[]>([]);
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((response) => response.json())
      .then((data) => {
        const validTokens = data.filter((token: CryptoCurrency) => token.currency && token.price);
        setTokens(validTokens);
      })
      .catch((error) => {
        console.error("Error fetching token prices:", error);
      });
  }, []);

  const calculateBuyAmount = useCallback((amount: string) => {
    if (!fromToken || !toToken || !amount || isNaN(Number(amount))) {
      setBuyAmount("");
      return;
    }

    const fromTokenData = tokens.find((token) => token.currency === fromToken);
    const toTokenData = tokens.find((token) => token.currency === toToken);

    if (!fromTokenData || !toTokenData) {
      setBuyAmount("");
      return;
    }

    const exchangeRate = fromTokenData.price / toTokenData.price;
    const calculated = (Number(amount) * exchangeRate).toFixed(6);
    setBuyAmount(calculated);
  }, [fromToken, toToken, tokens]);

  useEffect(() => {
    if (fromToken && toToken && sellAmount) {
      setIsPriceLoading(true);
      const timer = setTimeout(() => {
        calculateBuyAmount(sellAmount);
        setIsPriceLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sellAmount, fromToken, toToken, calculateBuyAmount]);

  const handleSellAmountChange = (value: string) => {
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    if (decimalCount > 1) return;
    
    const parts = sanitizedValue.split('.');
    if (parts[1] && parts[1].length > 6) return;
    
    if (Number(sanitizedValue) < 0) return;
    
    setSellAmount(sanitizedValue);
  };

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setIsPriceLoading(true);
      const tempFromToken = fromToken;
      const tempToToken = toToken;
      const tempSellAmount = buyAmount;
      
      // Simulate loading delay
      setTimeout(() => {
        setFromToken(tempToToken);
        setToToken(tempFromToken);
        setSellAmount(tempSellAmount);
        setIsPriceLoading(false);
      }, 300);
    }
  };

  const simulateSwap = () => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve(success);
      }, 2000);
    });
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !sellAmount) {
      setError("Please fill in all fields.");
      return;
    }

    if (isNaN(Number(sellAmount))) {
      setError("Please enter a valid number.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      
      const success = await simulateSwap();
      
      if (success) {
        setSwapSuccess(true);
        // Reset form after delay
        setTimeout(() => {
          setSellAmount("");
          setBuyAmount("");
          setSwapSuccess(false);
        }, 3000);
      } else {
        setError("Transaction failed. Please try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Fancy Form</h1>
        
        <div className="bg-gray-800 rounded-3xl p-4">
        <TokenSelect 
            value={fromToken}
            onChange={setFromToken}
            label="Sell"
            amount={sellAmount}
            isLoading={isLoading}
            isPriceLoading={isPriceLoading}
            tokens={tokens}
            handleSellAmountChange={handleSellAmountChange}
          />
          
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              className="bg-gray-900 p-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
              onClick={handleSwapTokens}
              disabled={isLoading || !fromToken || !toToken}
              title="Swap tokens"
            >
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <TokenSelect 
            value={toToken}
            onChange={setToToken}
            label="Buy"
            amount={buyAmount}
            isLoading={isLoading}
            isPriceLoading={isPriceLoading}
            tokens={tokens}
          />

          <button
            onClick={handleSwap}
            disabled={!fromToken || !toToken || !sellAmount || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-2xl mt-4 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Swapping...
              </>
            ) : !fromToken || !toToken ? (
              'Select tokens'
            ) : !sellAmount ? (
              'Enter amount'
            ) : (
              'Get started'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900 rounded-xl">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {swapSuccess && (
            <div className="mt-4 p-4 bg-green-900 rounded-xl">
              <p className="text-green-200 text-center">Swap completed successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencySwapForm;