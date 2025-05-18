import React, { lazy, Suspense } from 'react';
import type { ReactNode, FC, ComponentType } from 'react';
import ReactLayerComponent from '@/react/layers/ReactLayerComponent';
import ThemeProvider from '@/react/providers/theme-provider';
import NavigationProvider from '@/react/providers/NavigationProvider';
import AuthProvider from '@/react/providers/AuthProvider';
import ToastProvider from '@/react/providers/ToastProvider';
import LoadingFallback from '@/components/reactComponents/LoadingFallback';

interface AppClientProps {
  componentName?: string;
  children?: ReactNode;
  additionalProviders?: Array<ComponentType<{ children: ReactNode }>>;
}

const AppClient: FC<AppClientProps> = ({ componentName, children, additionalProviders = [] }) => {
  const providers = [
    ThemeProvider,
    NavigationProvider,
    AuthProvider,
    ToastProvider,
    ...additionalProviders,
  ];

  const DynamicComponent = componentName
    ? lazy(() => {
        // Vite-friendly dynamic import with @vite-ignore
        return import(/* @vite-ignore */ `../components/reactComponents/${componentName}`)
          .catch(error => {
            console.error(`Failed to load component ${componentName}:`, error);
            return Promise.resolve({
              default: () => (
                <div className="text-red-500 p-4">
                  Failed to load component: {componentName}
                </div>
              )
            });
          });
      })
    : null;

  const content = (
    <div className="bg-background">
      {DynamicComponent && (
        <Suspense fallback={<div className="p-4">Loading component...</div>}>
          <DynamicComponent />
        </Suspense>
      )}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );

  return (
    <ReactLayerComponent providers={providers}>
      {content}
    </ReactLayerComponent>
  );
};

export default AppClient;
