import React from 'react';

interface NavigationProviderProps {
  children: React.ReactNode;
}

const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default NavigationProvider;
