import { useEffect, useRef, useState } from 'react';

import { useSnackbar } from '../../../shared/hooks/useSnackbar';
import {
  BpmnLintIssues,
  PropertiesPanel,
  checkForLinterIssues,
} from '../../../Components/BusinessComponents/Modeler/helpers';
import Modeler from 'camunda-bpmn-js/lib/base/Modeler';
import { useBpmnToolOptions } from '../../../Providers/BpmnToolOptions/useBpmnToolOptions';

export const useModeler = (bpmnModelerInstance: Modeler, content?: string) => {
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const diagramPropertiesRef = useRef<HTMLDivElement>(null);
  const [hasLintError, setHasLintError] = useState(false);

  const { getModelerProviders } = useBpmnToolOptions();

  const propertiesPanel: PropertiesPanel =
    bpmnModelerInstance.get('propertiesPanel');

  const { showAlert } = useSnackbar();

  const attachModeler = () => {
    if (!diagramContainerRef.current || !diagramPropertiesRef.current) {
      showAlert({
        message: 'Diagram or Properties ref are undefined',
        severity: 'danger',
      });
      return;
    }

    bpmnModelerInstance.attachTo(diagramContainerRef.current);

    const providers = getModelerProviders();
    providers.forEach(({ priority, instance: ProviderInstance }) => {
      propertiesPanel.registerProvider(priority, new ProviderInstance());
    });

    propertiesPanel.attachTo(diagramPropertiesRef.current);
  };

  useEffect(() => {
    if (diagramContainerRef.current && diagramPropertiesRef.current) {
      if (!content) {
        bpmnModelerInstance
          .createDiagram()
          .then(() => attachModeler())
          .catch(() =>
            showAlert({
              message: 'Failed to render file',
              severity: 'danger',
            }),
          );
      } else {
        bpmnModelerInstance
          .importXML(content)
          .then(() => attachModeler())
          .catch(() =>
            showAlert({
              message: 'Failed to import file',
              severity: 'danger',
            }),
          );
      }

      bpmnModelerInstance.on(
        'linting.completed',
        ({ issues }: { issues: BpmnLintIssues }) => {
          setHasLintError(checkForLinterIssues(issues));
        },
      );
    }
  }, [bpmnModelerInstance, diagramContainerRef, diagramPropertiesRef, content]);

  return {
    diagramContainerRef,
    diagramPropertiesRef,
    hasLintError,
  };
};
