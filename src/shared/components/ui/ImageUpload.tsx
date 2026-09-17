import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadService } from '@/services/api/upload.service';
import { env } from '@/config/env';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Cropper from 'react-easy-crop';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string; // Kept for interface compatibility, but we might want to pass sx instead. We'll use sx or style.
  placeholder?: string;
  folderPath?: string;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileType: string,
  fileName: string
): Promise<File> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(new File([blob], fileName, { type: fileType, lastModified: Date.now() }));
        }
      },
      fileType,
      0.9
    );
  });
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Upload image',
  folderPath
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropAndUpload = async () => {
    if (!imageSrc || !selectedFile || !croppedAreaPixels) return;

    try {
      setIsUploading(true);
      setCropModalOpen(false);

      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        selectedFile.type,
        selectedFile.name
      );

      const url = await uploadService.uploadImage(croppedFile, folderPath);
      onChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setImageSrc(null);
      setSelectedFile(null);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setImageSrc(null);
    setSelectedFile(null);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const displayUrl = value ? (value.startsWith('http') ? value : `${env.apiUrl}${value}`) : null;

  return (
    <Box
      onClick={() => fileInputRef.current?.click()}
      className={className}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: className ? undefined : 128,
        height: className ? undefined : 128,
        minHeight: className ? undefined : 128,
        border: displayUrl ? 'none' : '2px dashed #D1D5DB',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#F9FAFB',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: '#F3F4F6',
        },
      }}
    >
      {isUploading ? (
        <CircularProgress size={32} />
      ) : displayUrl ? (
        <>
          <Box
            component="img"
            src={displayUrl}
            alt="Uploaded"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: '#E5E7EB' },
            }}
          >
            <X size={16} color="#EF4444" />
          </IconButton>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, color: 'text.secondary' }}>
          <Upload size={24} style={{ marginBottom: 4 }} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
            {placeholder}
          </Typography>
        </Box>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Dialog open={cropModalOpen} onClose={handleCropCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Crop Image</DialogTitle>
        <DialogContent sx={{ p: 0, height: 400, position: 'relative' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCropCancel} sx={{ color: '#6B7280', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCropAndUpload}
            sx={{ backgroundColor: '#7C3AED', fontWeight: 800, borderRadius: '8px' }}
          >
            Crop & Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
