import React, { FC } from 'react';
import Typography from '@mui/joy/Typography';

import { BaseModal } from '../../../Components/GenericComponents/BaseModal/BaseModal';

type ModelerShortcutsProps = {
  open: boolean;
  onCancelClick(): void;
};

export const ModelerShortcuts: FC<ModelerShortcutsProps> = ({
  open,
  onCancelClick,
}) => {
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);

  const controlSymbol = isMac ? '⌘' : 'Ctrl';

  return (
    <BaseModal open={open} onClose={onCancelClick}>
      <>
        <Typography level="h2">Keyboard Shortcuts</Typography>
        <table>
          <tbody>
            <tr>
              <td>Open diagram from local file system</td>
              <td className="binding">{controlSymbol} + O</td>
            </tr>
            <tr>
              <td>Download BPMN 2.0 diagram</td>
              <td className="binding">{controlSymbol} + S</td>
            </tr>
            <tr>
              <td>Undo</td>
              <td className="binding">{controlSymbol} + Z</td>
            </tr>
            <tr>
              <td>Redo</td>
              <td className="binding">{controlSymbol} + ⇧ + Z</td>
            </tr>
            <tr>
              <td>Select All</td>
              <td className="binding">{controlSymbol} + A</td>
            </tr>
            <tr>
              <td>Scrolling (Vertical)</td>
              <td className="binding">⌥ + Scrolling</td>
            </tr>
            <tr>
              <td>Scrolling (Horizontal)</td>
              <td className="binding">⌥ + ⇧ + Scrolling</td>
            </tr>
            <tr>
              <td>Direct Editing</td>
              <td className="binding">E</td>
            </tr>
            <tr>
              <td>Hand Tool</td>
              <td className="binding">H</td>
            </tr>
            <tr>
              <td>Lasso Tool</td>
              <td className="binding">L</td>
            </tr>
            <tr>
              <td>Space Tool</td>
              <td className="binding">S</td>
            </tr>
            <tr>
              <td>Replace Tool</td>
              <td className="binding">R</td>
            </tr>
            <tr>
              <td>Append anything</td>
              <td className="binding">A</td>
            </tr>
            <tr>
              <td>Create anything</td>
              <td className="binding">N</td>
            </tr>
          </tbody>
        </table>
      </>
    </BaseModal>
  );
};
