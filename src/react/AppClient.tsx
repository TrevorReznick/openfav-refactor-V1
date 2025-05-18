import React, { lazy, Suspense } from 'react';
import type { ReactNode, FC, ComponentType } from 'react';



// Simulazione di ThemeProvider
const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  console.log('ThemeProvider è stato applicato');
  return <>{children}</>;
};

// Simulazione di NavigationProvider
const NavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  console.log('NavigationProvider è stato applicato');
  return <>{children}</>;
};

// Simulazione di AuthProvider
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  console.log('AuthProvider è stato applicato');
  return <>{children}</>;
};

// Simulazione di componentLib
const componentLib = {
  get: (componentName: string) => {
    return {
      import: () => {
        console.log(`🔄 Loading component: ${componentName}`);
        // Simulazione del caricamento del componente
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(() => <div>{componentName} Component</div>);
          }, 1000);
        });
      }
    };
  }
};

// Simulazione di LoadingFallback
const LoadingFallback: FC = () => {
  return <div className="p-4">Loading...</div>;
};

// Interfaccia per le props di AppClient
interface AppClientProps {
  componentName?: string;
  children?: ReactNode;
  additionalProviders?: Array<ComponentType<{ children: ReactNode }>>;
}

// Componente AppClient
const AppClient: FC<AppClientProps> = ({ componentName, children, additionalProviders = [] }) => {
  // Providers di base: Theme, Navigation e Auth
  const providers = [
    ThemeProvider,
    NavigationProvider,
    AuthProvider,
    ...additionalProviders,
  ];

  // Caricamento dinamico in base al componentName
  const DynamicComponent = componentName
    ? lazy(() => {
        console.log(`🔄 Loading component: ${componentName}`);
        return componentLib.get(componentName).import().then((Component: any) => ({
          default: Component,
        }));
      })
    : null;

  // Costruiamo il contenuto da renderizzare
  const content = (
    <div className="bg-background">
      {DynamicComponent && (
        <Suspense fallback={<LoadingFallback />}>
          <DynamicComponent />
        </Suspense>
      )}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );

  // Wrap content with all providers
  const wrapWithProviders = (children: ReactNode) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );

  return wrapWithProviders(content);
};

export default AppClient;
