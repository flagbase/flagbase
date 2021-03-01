import React from 'react';
import { Global, css } from '@emotion/react';
import 'antd/dist/antd.css';

export const GlobalStyle = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        color: #e1e1e6;
      }
    `}
  />
);
