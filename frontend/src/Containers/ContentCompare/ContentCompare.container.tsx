import React from 'react';

import { Compare } from '../../Components/BusinessComponents/Compare/Compare';
import { useCompareData } from './hooks/useCompareData';
import { CompareActionBar } from './components/CompareActionBar';

export const Component = () => {
  const {
    resourceId,
    leftContent,
    rightContent,
    isDiffsModalOpen,
    leftXmlContent,
    rightXmlContent,
    setIsDiffsModalOpen,
  } = useCompareData();

  return (
    <>
      <CompareActionBar
        resourceId={resourceId}
        onDiffsDisplay={() => setIsDiffsModalOpen(true)}
      />
      {!leftContent || !rightContent ? (
        <>Loading...</>
      ) : (
        <Compare
          leftContent={leftXmlContent}
          rightContent={rightXmlContent}
          isDiffsModalOpen={isDiffsModalOpen}
          setIsDiffsModalOpen={setIsDiffsModalOpen}
          leftSideTitle={leftContent.status}
          rightSideTitle={rightContent.status}
        />
      )}
    </>
  );
};

Component.displayName = 'ContentCompareContainer';
