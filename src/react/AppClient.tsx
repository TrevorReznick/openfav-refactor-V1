import React, { lazy, Suspense } from 'react';
import type { ReactNode, FC, ComponentType } from 'react';
import GenericComponent from '@/react/ReactLayerComponent';
import ThemeProvider from '@/react/providers/theme-provider';
import NavigationProvider from '@/react/providers/NavigationProvider';
import AuthProvider from '@/react/providers/AuthProvider';
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
    ...additionalProviders,
  ];

  const DynamicComponent = componentName
    ? lazy(() => {
      return new Promise<{ default: React.ComponentType }>(resolve => {
        setTimeout(() => {
          resolve({
            default: () => <div>Test Component Loaded for {componentName}</div>
          });
        }, 500);
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
    <GenericComponent providers={providers}>
      {content}
    </GenericComponent>
  );
};

export default AppClient;
