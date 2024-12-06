import { FolderTree } from '../../Components/BusinessComponents/FolderTree';
import { Sheet } from '@mui/joy';
import React from 'react';

import './BpmnLayoutContainer.scss';
import { Header } from '../../Components/GenericComponents/Header/Header';
import { useBpmnLayoutErrorBoundary } from './hooks/useBpmnLayoutErrorBoundary';
import { ActionButton } from '../../Components/GenericComponents/ActionButton/ActionButton';
import { Home } from '@mui/icons-material';

export const ErrorBoundary = () => {
  const { resourceId, error, callbacks } = useBpmnLayoutErrorBoundary();

  return (
    <div className="mainContainer">
      <Sheet
        className="folderTree"
        sx={{
          position: 'sticky',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <FolderTree
          selectedId={resourceId}
          onNodeClick={callbacks.onFolderTreeItemClick}
        />
      </Sheet>
      <Sheet className="innerContent">
        <Header
          title={error.errorResponse.error}
          description={error.errorResponse.message as string}
          breadcrumbs={[]}
          actions={
            <ActionButton
              to="/root"
              content="Back to root"
              label="Back to root folder"
              leftIcon={<Home fontSize="small" />}
            />
          }
        />
      </Sheet>
    </div>
  );
};

ErrorBoundary.displayName = 'BpmnLayoutErrorBoundary';
