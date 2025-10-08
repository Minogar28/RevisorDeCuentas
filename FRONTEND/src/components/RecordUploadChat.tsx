import React, { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
  LinearProgress,
  Paper,
} from "@mui/material";
import { keyframes } from "@mui/system";

import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ChatBubble as ChatBubbleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

// Agrega estos campos a tu ChatBridge si usas TS:
// isProcessing: boolean;
// uploadProgress: { processed: number; total: number };

type ChatBridge = {
  messages: any[];
  inputText: string;
  setInputText: (v: string) => void;
  handleSendMessage: () => Promise<void> | void;
  handleFileUpload: (e: any, ref: React.RefObject<HTMLInputElement>) => Promise<void> | void;
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: { processed: number; total: number };
};

export function RecordUploadChat({ chat }: { chat: ChatBridge }) {
  const {
    messages,
    inputText,
    setInputText,
    handleSendMessage,
    handleFileUpload,
    isUploading,
    isProcessing,
    uploadProgress,
  } = chat;

  const fileInputRef = useRef<HTMLInputElement>(null!);
  const messagesEndRef = useRef<HTMLDivElement>(null!);

  // auto-scroll también cuando cambia el progreso/cargando
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUploading, isProcessing, uploadProgress]);

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case "sending":
        return <CircularProgress size={16} color="primary" />;
      case "sent":
        return <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />;
      case "processed":
        return <CheckCircleIcon sx={{ fontSize: 16, color: "primary.main" }} />;
      case "error":
        return <ErrorIcon sx={{ fontSize: 16, color: "error.main" }} />;
      default:
        return null;
    }
  };

  // lógica de la burbuja (debajo del último mensaje)
  const showUploadBar = isUploading && uploadProgress?.total > 0;
  const showProcessingBar = !showUploadBar && isProcessing;
  const percent = showUploadBar
    ? Math.round((uploadProgress.processed / uploadProgress.total) * 100)
    : 0;

  // animación sutil de “latido”
  const pulse = keyframes`
    0% { opacity: .65; transform: translateY(0px); }
    50% { opacity: 1; transform: translateY(-1px); }
    100% { opacity: .65; transform: translateY(0px); }
  `;
  const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: .5; }
  40% { transform: scale(1); opacity: 1; }
`;
  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      <CardHeader
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "primary.50",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          backdropFilter: "blur(4px)",
        }}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChatBubbleIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography variant="h6" color="primary.main">
              Carga de Registros
            </Typography>
          </Box>
        }
      />

      <CardContent
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        {/* Área de mensajes con scroll */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pr: 0.5,
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "90%",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: msg.type === "user" ? "primary.main" : "grey.100",
                  color: msg.type === "user" ? "common.white" : "text.primary",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {msg.content}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  {msg.type === "user" && getMessageStatusIcon(msg.status)}
                </Box>
              </Box>
            </Box>
          ))}

          {/* 🔽 Burbuja animada DEBAJO del último mensaje, alineada a la izquierda */}
          {(showUploadBar || showProcessingBar) && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Paper
                sx={{
                  maxWidth: "90%",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: "grey.100",
                  color: "text.primary",
                  minWidth: 260,
                  animation: `${pulse} 1.2s ease-in-out infinite`,
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {showUploadBar ? "Procesando archivo…" : "Procesando solicitud…"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, py: 0.5 }}>
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "text.secondary",
                        animation: `${dotBounce} 1.2s ease-in-out infinite`,
                        animationDelay: `${i * 0.18}s`,
                      }}
                    />
                  ))}
                </Box>

                {showUploadBar && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: "block", color: "text.secondary" }}
                  >
                    {uploadProgress.processed} / {uploadProgress.total} filas ({percent}%)
                  </Typography>
                )}
              </Paper>
            </Box>
          )}

          {/* El scroll final se ancla DESPUÉS de la burbuja */}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Input + botones */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe información del paciente..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: 5,
              "& .MuiOutlinedInput-root": { borderRadius: 5 },
            }}
          />

          <Tooltip title="Enviar mensaje">
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              sx={{ borderRadius: 5, border: 1, borderColor: "grey.300", p: 1.25 }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Subir archivo Excel" arrow>
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{ borderRadius: 5, border: 1, borderColor: "grey.300", p: 1.25 }}
            >
              {isUploading ? <CircularProgress size={16} /> : <AttachFileIcon />}
            </IconButton>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileUpload(e, fileInputRef)}
            style={{ display: "none" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
