import { useMemo } from 'react';
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';
import BpmnViewer from 'camunda-bpmn-js/lib/camunda-platform/NavigatedViewer';

import { useBpmnToolOptions } from '../../Providers/BpmnToolOptions/useBpmnToolOptions';

export const useModelerInstance = () => {
  const { getModelerExtensions, getModelerModules, getModelerLinting } =
    useBpmnToolOptions();

  const lintingOptions = getModelerLinting();

  const modeler = useMemo(() => {
    return new BpmnModeler({
      keyboard: { bindTo: document },
      additionalModules: getModelerModules(),
      ...(lintingOptions.active ? { linting: lintingOptions } : {}),
      moddleExtensions: getModelerExtensions(),
    });
  }, []);

  const getModelerInstance = () => {
    return modeler;
  };

  const getViewerInstance = (additionalOptions = {}) => {
    return new BpmnViewer({
      additionalModules: [...getModelerModules(true)],
      moddleExtensions: getModelerExtensions(),
      ...additionalOptions,
    });
  };

  return {
    getModelerInstance,
    getViewerInstance,
  };
};
