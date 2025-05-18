import React from 'react';
import type { ReactNode } from 'react';

// Simulazione di ThemeProvider
const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('ThemeProvider è stato applicato');
  return <>{children}</>;
};

// Simulazione di LocaleProvider
const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('LocaleProvider è stato applicato');
  return <>{children}</>;
};

// Interfaccia per le props di DynamicWrapper
interface DynamicWrapperProps {
  providers: Array<React.FC<{ children: ReactNode }>>;
  children: ReactNode;
}

// DynamicWrapper che wrappa i children nei provider
const DynamicWrapper = ({ providers, children }: DynamicWrapperProps) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};

// Componente di test
const TestComponent = () => {
  return (
    <DynamicWrapper providers={[ThemeProvider, LocaleProvider]}>
      <div>Contenuto dei children</div>
    </DynamicWrapper>
  );
};

export default TestComponent;
