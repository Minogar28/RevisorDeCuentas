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
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  ChatBubble as ChatBubbleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useChat } from "../hooks/useChat"; // tu hook JS
import { toast } from "sonner";

export function RecordUploadChat() {
  const { messages, inputText, setInputText, handleSendMessage, handleFileUpload, isUploading } = useChat();
  const fileInputRef = useRef(null);
const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMessageStatusIcon = (status) => {
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

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3, // Redondeo general de card
        overflow: "hidden",
      }}
      elevation={3}
    >
      <CardHeader
        sx={{ bgcolor: "primary.50", borderBottom: 1, borderColor: "primary.200" }}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ChatBubbleIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography variant="h6" color="primary.main">Carga de Registros</Typography>
          </Box>
        }
      />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        {/* Mensajes */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent: message.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "80%",
                  borderRadius: 3, // Mensajes con bordes redondeados 20px
                  p: 2,
                  bgcolor: message.type === "user" ? "primary.main" : "grey.100",
                  color: message.type === "user" ? "common.white" : "text.primary",
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {message.content}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                  {message.type === "user" && getMessageStatusIcon(message.status)}
                </Box>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Input + Botones en la misma línea */}
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
              borderRadius: 5, // 20px aproximadamente
              '& .MuiOutlinedInput-root': {
                borderRadius: 5,
              },
            }}
          />

          <Tooltip title="Enviar mensaje">
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              sx={{
                borderRadius: 5,
                border: 1,
                borderColor: "grey.300",
                p: 1.25,
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Subir archivo Excel (.xlsx, .xls)" arrow>
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              sx={{
                borderRadius: 5,
                border: 1,
                borderColor: "grey.300",
                p: 1.25,
              }}
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
