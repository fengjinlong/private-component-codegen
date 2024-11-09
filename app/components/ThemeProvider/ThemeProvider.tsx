import React from 'react';
import { ConfigProvider, theme } from 'antd';
import type { ThemeProviderProps } from './interface';

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, isDarkMode = true }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
