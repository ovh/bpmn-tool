import React from 'react';
import { createRoot } from 'react-dom/client';

import { MainContainer } from './MainContainer';
import { BpmnToolOptions } from './Providers/BpmnToolOptions';

export const bootstrapBpmnTool = (options: BpmnToolOptions = {}) => {
  createRoot(document.getElementById('root')!).render(
    <MainContainer options={options} />,
  );
};
