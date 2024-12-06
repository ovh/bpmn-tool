import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  ListItemDecorator,
  Stack,
} from '@mui/joy';
import {
  Home,
  UploadFile,
  Image,
  FileDownload,
  Info,
  Done,
  Save,
} from '@mui/icons-material';

import { ActionBar } from '../../../Components/GenericComponents/ActionBar/ActionBar';

type ModelerActionBarProps = {
  resourceId: string;
  hasLintError: boolean;
  onFileUpload: (files: FileList) => void;
  onFileExport: (exportType: 'svg' | 'bpmn') => void;
  onDiagramSave: () => void;
  onDiagramPublish: () => void;
  onShortcutDisplay: () => void;
};

export const ModelerActionBar = ({
  resourceId,
  // hasLintError,
  onFileUpload,
  onFileExport,
  onDiagramSave,
  onDiagramPublish,
  onShortcutDisplay,
}: ModelerActionBarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <ActionBar>
      <Stack gap={1} direction="row">
        <Button
          variant="outlined"
          color="neutral"
          component={Link}
          to={`/${resourceId}`}
        >
          <Home fontSize="small" />
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outlined"
          color="neutral"
          startDecorator={<UploadFile fontSize="small" />}
        >
          Upload
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple={false}
          accept=".bpmn"
          onChange={event => {
            event.preventDefault();
            if (event.target.files && event.target.files[0]) {
              onFileUpload(event.target.files);
            }
          }}
        />

        <Dropdown>
          <MenuButton startDecorator={<FileDownload fontSize="small" />}>
            Export
          </MenuButton>
          <Menu>
            <MenuItem onClick={() => onFileExport('svg')}>
              <ListItemDecorator>
                <Image />
              </ListItemDecorator>
              Export as SVG
            </MenuItem>
            <MenuItem onClick={() => onFileExport('bpmn')}>
              <ListItemDecorator>
                <FileDownload />
              </ListItemDecorator>
              Export as BPMN
            </MenuItem>
          </Menu>
        </Dropdown>
      </Stack>
      <Stack gap={1} direction="row" justifyContent="flex-end">
        <Button onClick={onShortcutDisplay} variant="outlined" color="neutral">
          <Info fontSize="small" />
        </Button>

        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<Save fontSize="small" />}
          onClick={onDiagramSave}
        >
          Save
        </Button>

        <Button
          onClick={onDiagramPublish}
          variant="outlined"
          // disabled={hasLintError}
          color="success"
          endDecorator={<Done fontSize="small" />}
        >
          Publish
        </Button>
      </Stack>
    </ActionBar>
  );
};
