import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface FunnelState {
  orderId: number | null;
  email: string;
  firstName: string;
  purchasedProducts: string[];
}

interface FunnelContextValue extends FunnelState {
  setOrder: (orderId: number, email: string, firstName: string) => void;
  addProduct: (slug: string) => void;
  clearFunnel: () => void;
}

const STORAGE_KEY = "titan-funnel-state";

function loadState(): FunnelState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { orderId: null, email: "", firstName: "", purchasedProducts: [] };
}

function saveState(state: FunnelState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>(loadState);

  const setOrder = useCallback((orderId: number, email: string, firstName: string) => {
    const next = { ...state, orderId, email, firstName };
    setState(next);
    saveState(next);
  }, [state]);

  const addProduct = useCallback((slug: string) => {
    const next = {
      ...state,
      purchasedProducts: [...state.purchasedProducts, slug],
    };
    setState(next);
    saveState(next);
  }, [state]);

  const clearFunnel = useCallback(() => {
    const empty: FunnelState = { orderId: null, email: "", firstName: "", purchasedProducts: [] };
    setState(empty);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <FunnelContext.Provider value={{ ...state, setOrder, addProduct, clearFunnel }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used within FunnelProvider");
  return ctx;
}
