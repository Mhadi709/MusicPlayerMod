import React, { createContext, useContext, useState } from 'react';
import UniversalAlert, { UniversalAlertProps } from '../components/common/UniversalAlert';

const AlertContext = createContext<any>(null);

export const AlertProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);

  const showAlert = (options: any) => { setConfig(options); setVisible(true); };
  const hideAlert = () => setVisible(false);
  const [config, setConfig] = useState<Partial<UniversalAlertProps>>({});
  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
     {visible && (
  <UniversalAlert
    {...(config as UniversalAlertProps)}
    visible={visible}
    onCancel={hideAlert}
    onConfirm={() => {
      (config as UniversalAlertProps).onConfirm?.();
      hideAlert();
    }}
  />
)}
    </AlertContext.Provider>
  );
};

export const useAppAlert = () => useContext(AlertContext);