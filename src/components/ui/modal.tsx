import React from 'react';
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  DialogContent,
  DialogContentProps,
  DialogActions,
  DialogActionsProps,
  IconButton,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import { Button } from './button';

interface ModalProps extends Omit<DialogProps, 'open'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalHeaderProps {
  children: React.ReactNode;
}

interface ModalContentProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  maxWidth,
  fullWidth = true,
  ...props
}) => {
  const getMaxWidth = () => {
    if (maxWidth) return maxWidth;
    switch (size) {
      case 'sm':
        return 'sm';
      case 'lg':
        return 'lg';
      case 'xl':
        return 'xl';
      default:
        return 'md';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={getMaxWidth()}
      fullWidth={fullWidth}
      {...props}
    >
      {title && (
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: 'grey.500',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}
      {children}
    </Dialog>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => (
  <Box sx={{ mb: 2 }}>{children}</Box>
);

const ModalContent: React.FC<ModalContentProps> = ({ children }) => (
  <DialogContent sx={{ pt: 0 }}>
    <Box sx={{ mb: 3 }}>{children}</Box>
  </DialogContent>
);

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => (
  <DialogActions sx={{ p: 2, pt: 0 }}>
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
      {children}
    </Box>
  </DialogActions>
);

// Confirmation Modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getSeverity = () => {
    switch (variant) {
      case 'danger':
        return 'error' as const;
      case 'warning':
        return 'warning' as const;
      default:
        return 'info' as const;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger' as const;
      case 'warning':
        return 'primary' as const;
      default:
        return 'primary' as const;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <Alert severity={getSeverity()} icon={getIcon()}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Alert>
      </ModalHeader>

      <ModalContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </ModalContent>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={getButtonVariant()} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter };
