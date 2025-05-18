import React from 'react';
import { toast } from 'react-hot-toast';

const TestComponent = () => {
  const showToast = () => {
    toast.success('Ecco un messaggio di successo!');
    setTimeout(() => {
      toast.error('Ecco un messaggio di errore!');
    }, 2000);
    setTimeout(() => {
      toast('Ecco un messaggio normale!');
    }, 4000);
  };

  return (
    <div className="p-4">
      <p>Ciao; stai vedendo un componente dinamico!</p>
      <button 
        onClick={showToast}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
      >
        Mostra Toast
      </button>
    </div>
  );
};

export default TestComponent;
