import React, {
  ChangeEventHandler,
  DragEventHandler,
  FC,
  useRef,
  useState,
} from 'react';
import { Typography, Link, Box, Sheet } from '@mui/joy';
import { UploadFile } from '@mui/icons-material';

import './DropZone.css';

type DropZoneProps = {
  onFileUploaded: (files: FileList) => void;
};
export const DropZone: FC<DropZoneProps> = ({ onFileUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag: DragEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop: DragEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUploaded(e.dataTransfer.files);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUploaded(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const UploadLogo = (
    <Box
      sx={{
        p: 1,
        mb: 1,
        bgcolor: 'background.level1',
        borderRadius: '50%',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: 'background.level2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UploadFile fontSize="small" />
      </Box>
    </Box>
  );

  return (
    <Sheet
      className={dragActive ? 'dropzone drag-active' : 'dropzone'}
      onDragEnter={handleDrag}
      sx={[
        {
          bgcolor: 'white',
          borderRadius: 'sm',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          px: 3,
          flexGrow: 1,
        },
      ]}
    >
      {UploadLogo}
      <Typography level="body-md" textAlign="center">
        <Link
          className="upload-button"
          component="button"
          overlay
          onClick={onButtonClick}
        >
          Click to upload
        </Link>{' '}
        or drag and drop
      </Typography>
      {dragActive && (
        <div
          className="element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".bpmn"
        style={{ display: 'none' }}
        multiple={false}
        onChange={handleChange}
      />
    </Sheet>
  );
};
