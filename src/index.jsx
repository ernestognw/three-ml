import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import { ThemeProvider } from 'styled-components';
import { VisualizationProvider } from '@providers/visualization';
import theme from '@config/theme';
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <VisualizationProvider>
      <App />
    </VisualizationProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
