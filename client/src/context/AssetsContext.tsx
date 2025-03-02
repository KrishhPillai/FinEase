"use client"

import React, { createContext, useContext, useState } from 'react';
import { PortfolioAsset } from '@/lib/types';

interface AssetsContextType {
  assets: PortfolioAsset[];
  setAssets: React.Dispatch<React.SetStateAction<PortfolioAsset[]>>;
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const AssetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);

  return (
    <AssetsContext.Provider value={{ assets, setAssets }}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  return context;
};
