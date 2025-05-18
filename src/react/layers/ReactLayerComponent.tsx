import React from 'react';

interface ReactLayerComponentProps {
  providers: Array<React.ComponentType<{ children: React.ReactNode }> | React.ComponentClass<{ children: React.ReactNode }, any>>;
  children: React.ReactNode;
}

const ReactLayerComponent: React.FC<ReactLayerComponentProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, Provider) => (
        <Provider>{acc}</Provider>
      ), children)}
    </>
  );
};

export default ReactLayerComponent;
