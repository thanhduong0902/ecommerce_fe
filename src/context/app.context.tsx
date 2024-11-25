import { createContext, useState } from "react";
import { ExtendedPurchase } from "../types/purchase.type";
import { User } from "../types/user.type";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import { Item } from "../types/product.type";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendedPurchases: ExtendedPurchase[];
  setExtendedPurchases: React.Dispatch<
    React.SetStateAction<ExtendedPurchase[]>
  >;
  reset: () => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchImageValue: string;
  setSearchImageValue: React.Dispatch<React.SetStateAction<string>>;
  targetValue: number;
  setTargetValue: React.Dispatch<React.SetStateAction<number>>;
  setCart: React.Dispatch<React.SetStateAction<Item[]>>;
  cart: Item[];
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null,
  searchValue: "",
  setSearchValue: () => "",
  targetValue: 0,
  setTargetValue: () => null,
  cart: [],
  setCart: () => null,
  searchImageValue: "",
  setSearchImageValue: () => "",
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({
  children,
  defaultValue = initialAppContext,
}: {
  children: React.ReactNode;
  defaultValue?: AppContextInterface;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    defaultValue.isAuthenticated
  );

  const [extendedPurchases, setExtendedPurchases] = useState<
    ExtendedPurchase[]
  >(defaultValue.extendedPurchases);

  const [profile, setProfile] = useState<User | null>(defaultValue.profile);

  const [searchValue, setSearchValue] = useState("");

  const [searchImageValue, setSearchImageValue] = useState("");

  const [targetValue, setTargetValue] = useState(0);

  const [cart, setCart] = useState<Item[]>([]);

  const reset = () => {
    setIsAuthenticated(false);
    setExtendedPurchases([]);
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset,
        searchValue,
        setSearchValue,
        targetValue,
        setTargetValue,
        cart,
        setCart,
        searchImageValue,
        setSearchImageValue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
