import React from "react";
import { Modal as MuiModal, Box, IconButton, Typography } from "@mui/material";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  const sizeMap = {
    sm: "400px",
    md: "600px",
    lg: "800px",
    xl: "1000px",
  };

  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: sizeMap[size],
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        {title && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "divider",
              px: 3,
              py: 2,
            }}
          >
            <Typography variant="h6" component="h2" id="modal-title">
              {title}
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <X size={20} />
            </IconButton>
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            px: 3,
            py: 2,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        {footer && (
          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              px: 3,
              py: 2,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </MuiModal>
  );
};

export default Modal;
