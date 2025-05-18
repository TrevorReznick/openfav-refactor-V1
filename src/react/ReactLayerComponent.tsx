import React from 'react';

interface DynamicWrapperProps {
  providers: Array<React.ComponentType<{ children: React.ReactNode }> | React.ComponentClass<{ children: React.ReactNode }, any>>;
  children: React.ReactNode;
}

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, Provider) => (
        <Provider>{acc}</Provider>
      ), children)}
    </>
  );
};

export default DynamicWrapper;
