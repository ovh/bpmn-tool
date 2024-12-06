import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ModelerActionBar } from './components/ModelerActionBar';
import { ModelerShortcuts } from '../../Components/BusinessComponents/ModelerShortcuts/ModelerShortcuts';
import { useContentModeler } from './hooks/useContentModeler';
import { useModeler } from './hooks/useModeler';
import { Modeler } from '../../Components/BusinessComponents/Modeler/Modeler';
import { useModelerInstance } from '../../shared/hooks/useModelerInstance';

export const Component = () => {
  // share modeler instance in order to avoid create instance in useContentModeler and useModeler
  const { getModelerInstance } = useModelerInstance();
  const bpmnModelerInstance = getModelerInstance();

  const {
    resourceId,
    draftXmlContent,
    isShortcurtModalOpen,
    setIsShortcurtModalOpen,
    onFileUpload,
    onFileExport,
    onDiagramSave,
    onDiagramPublish,
    actionData,
  } = useContentModeler(bpmnModelerInstance);

  const { diagramContainerRef, diagramPropertiesRef, hasLintError } =
    useModeler(bpmnModelerInstance, draftXmlContent);

  return (
    <>
      {actionData && actionData.formAction === 'saveContentBeforePublish' && (
        <Navigate to="./publish" />
      )}
      <ModelerActionBar
        resourceId={resourceId}
        hasLintError={hasLintError}
        onFileUpload={onFileUpload}
        onFileExport={onFileExport}
        onDiagramSave={onDiagramSave}
        onDiagramPublish={onDiagramPublish}
        onShortcutDisplay={() => setIsShortcurtModalOpen(true)}
      />
      <Modeler
        diagramContainerRef={diagramContainerRef}
        diagramPropertiesRef={diagramPropertiesRef}
      />
      <ModelerShortcuts
        open={isShortcurtModalOpen}
        onCancelClick={() => setIsShortcurtModalOpen(false)}
      />
      <Outlet />
    </>
  );
};

Component.displayName = 'ContentModelerContainer';
