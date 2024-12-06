/* eslint-disable no-console */

import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// @ts-ignore
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
// @ts-ignore
import { diff } from 'bpmn-js-differ';
// @ts-ignore
// import { ChangeHandler } from 'bpmn-js-diffing';

import type { Nullable } from '../../../../shared/types/Nullable';
import { useModelerInstance } from '../../../../shared/hooks/useModelerInstance';
import { useBpmnToolOptions } from '../../../../Providers/BpmnToolOptions/useBpmnToolOptions';

type DiffSimple = {
  id: string;
  name?: string;
  text?: string;
  $type?: string;
} & unknown;

type DiffGeneric = {
  attrs: Record<string, unknown>;
  model: { id: string; name?: string; type?: string };
};

export type Diffs = Nullable<{
  _added: Record<string, DiffSimple>;
  _changed: Record<string, DiffGeneric>;
  _layoutChanged: Record<string, DiffSimple>;
  _removed: Record<string, DiffSimple>;
}>;
type BpmnViewerType = {
  get<T extends Record<string, unknown>>(module: string): T;
  on(event: string, callback: (event: Event) => void): void;
  attachTo: (parentNode: HTMLElement) => void;
};

export const useCompare = (leftContent: string, rightContent: string) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const { getModelerDiffChangeHandler } = useBpmnToolOptions();
  const { getViewerInstance } = useModelerInstance();
  const leftViewer = useMemo(
    () =>
      getViewerInstance({
        height: '100%',
        width: '100%',
        canvas: {
          deferUpdate: false,
        },
      }),
    [],
  );

  const rightViewer = useMemo(
    () =>
      getViewerInstance({
        height: '100%',
        width: '100%',
        canvas: {
          deferUpdate: false,
        },
      }),
    [],
  );

  const [rightSideLoaded, setRightSideLoaded] = useState(false);
  const [leftSideLoaded, setLeftSideLoaded] = useState(false);

  const [diffs, setDiffs] = useState<Diffs>(null);

  const attachViewer = useCallback(
    (ref: RefObject<HTMLDivElement>, viewer: BpmnViewerType) => {
      if (!ref.current) {
        console.error('attachModeler - Diagram ref is undefined');
        return;
      }

      viewer.attachTo(ref.current);
    },
    [],
  );

  const syncViewers = (a: BpmnViewerType, b: BpmnViewerType) => {
    let changing = false;

    const update = (viewer: BpmnViewerType) => {
      return (e: Event) => {
        if (changing) {
          return;
        }

        changing = true;

        // @ts-ignore
        viewer.get('canvas').viewbox(e.viewbox);
        changing = false;
      };
    };

    const syncViewbox = (a1: BpmnViewerType, b1: BpmnViewerType) => {
      a1.on('canvas.viewbox.changed', update(b1));
    };

    syncViewbox(a, b);
    syncViewbox(b, a);
  };

  const highlight = useCallback(
    (viewer: BpmnViewer, elementId: string, marker: string) => {
      try {
        // @ts-ignore
        viewer.get('canvas').addMarker(elementId, marker);
      } catch (e) {
        /* empty */
      }
    },
    [],
  );

  const addMarker = useCallback(
    (
      viewer: BpmnViewer,
      elementId: string,
      className: string,
      symbol: string,
    ) => {
      const overlays = viewer.get('overlays');

      try {
        // @ts-ignore
        overlays.add(elementId, 'diff', {
          position: {
            top: -12,
            right: 12,
          },
          html: `<span class="marker ${className}">${symbol}</span>`,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [],
  );

  // Load content for left side
  useEffect(() => {
    if (!leftRef.current && !leftSideLoaded) {
      return;
    }

    if (!leftContent) {
      return;
    }

    leftViewer
      .importXML(leftContent)
      .then(() => {
        attachViewer(leftRef, leftViewer);
        setLeftSideLoaded(true);
      })
      .catch(e => console.error('leftSide: ', e));
  }, [leftSideLoaded, leftContent]);

  // Load content for right side
  useEffect(() => {
    if (!rightRef.current && !rightSideLoaded) {
      return;
    }

    if (!rightContent) {
      return;
    }

    rightViewer
      .importXML(rightContent)
      .then(() => {
        attachViewer(rightRef, rightViewer);
        setRightSideLoaded(true);
      })
      .catch(e => console.error('rightSide: ', e));
  }, [rightSideLoaded, rightContent]);

  // Search for diff and sync viewers
  useEffect(() => {
    if (!rightSideLoaded || !leftSideLoaded) {
      return;
    }

    setDiffs(
      diff(
        rightViewer.getDefinitions(),
        leftViewer.getDefinitions(),
        getModelerDiffChangeHandler(),
      ),
    );
    syncViewers(leftViewer, rightViewer);
  }, [rightSideLoaded, leftSideLoaded]);

  /* DIFFS HANDLERS */
  useEffect(() => {
    if (
      !leftSideLoaded ||
      !rightSideLoaded ||
      !diffs?._changed ||
      !Object.values(diffs?._changed).length
    ) {
      return;
    }

    Object.values(diffs._changed).forEach(obj => {
      highlight(leftViewer, obj.model.id, 'diff-changed');
      addMarker(leftViewer, obj.model.id, 'marker-changed', '&#9998;');

      highlight(rightViewer, obj.model.id, 'diff-changed');
      addMarker(rightViewer, obj.model.id, 'marker-changed', '&#9998;');
    });
  }, [diffs?._changed]);

  useEffect(() => {
    if (
      !leftSideLoaded ||
      !rightSideLoaded ||
      !diffs?._added ||
      !Object.values(diffs?._added).length
    ) {
      return;
    }

    Object.values(diffs._added).forEach(obj => {
      highlight(leftViewer, obj.id, 'diff-added');
      addMarker(leftViewer, obj.id, 'marker-added', '&#43;');
    });
  }, [diffs?._added]);

  useEffect(() => {
    if (
      !leftSideLoaded ||
      !rightSideLoaded ||
      !diffs?._removed ||
      !Object.values(diffs?._removed).length
    ) {
      return;
    }

    Object.values(diffs._removed).forEach(obj => {
      highlight(rightViewer, obj.id, 'diff-removed');
      addMarker(rightViewer, obj.id, 'marker-removed', '&minus;');
    });
  }, [diffs?._removed]);

  useEffect(() => {
    if (
      !leftSideLoaded ||
      !rightSideLoaded ||
      !diffs?._layoutChanged ||
      !Object.values(diffs?._layoutChanged).length
    ) {
      return;
    }

    Object.values(diffs._layoutChanged).forEach(obj => {
      highlight(rightViewer, obj.id, 'diff-layout-changed');
      addMarker(rightViewer, obj.id, 'marker-layout-changed', '&#8680;');

      highlight(leftViewer, obj.id, 'diff-layout-changed');
      addMarker(leftViewer, obj.id, 'marker-layout-changed', '&#8680;');
    });
  }, [diffs?._layoutChanged]);

  // const displayChanges = () =>
  //   showModal<{ diffs: Diffs }>('CompareChanges', () => '', { diffs });

  return {
    leftRef,
    rightRef,
    diffs,
    // displayChanges,
  };
};
