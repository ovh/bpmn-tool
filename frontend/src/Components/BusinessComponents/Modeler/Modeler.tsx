import React, { FC, RefObject } from 'react';

import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';
import 'bpmn-js-color-picker/colors/color-picker.css';
import 'bpmn-js-embedded-comments/assets/comments.css';
import './Modeler.css';

type ModelerProps = {
  diagramContainerRef: RefObject<HTMLDivElement>;
  diagramPropertiesRef: RefObject<HTMLDivElement>;
};
export const Modeler: FC<ModelerProps> = ({
  diagramContainerRef,
  diagramPropertiesRef,
}) => {
  return (
    <div id="diagramContainer" ref={diagramContainerRef}>
      <div id="diagramProperties" ref={diagramPropertiesRef} />
    </div>
  );
};
