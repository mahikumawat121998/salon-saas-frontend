'use client';

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Sparkles,
  X,
  Send,
  Plus,
  Trash2,
  Calendar,
  Banknote,
  Users,
  Scissors,
  Bot,
  Maximize2,
  Minimize2,
  Minus,
  Zap,
} from 'lucide-react';
import { aiApiService, AiMessage, AiConversation } from '@/services/api/ai.service';
import { AiToolCard } from './AiToolCards';
import { MarkdownText } from './MarkdownText';
import { toast } from 'sonner';

interface AiChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState<Array<AiMessage & { structuredCards?: any[] }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskMenuAnchor, setTaskMenuAnchor] = useState<null | HTMLElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const loadConversations = async () => {
    try {
      const data = await aiApiService.getConversations();
      setConversations(data || []);
      if (!activeConversationId && data && data.length > 0) {
        loadConversation(data[0].id);
      }
    } catch {
      // Ignore initial load failure if empty
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      setActiveConversationId(id);
      const conv = await aiApiService.getConversation(id);
      if (conv && conv.messages) {
        setMessages(
          conv.messages.map((m) => ({
            ...m,
            structuredCards: m.toolResults
              ? Array.isArray(m.toolResults)
                ? m.toolResults
                : [m.toolResults]
              : undefined,
          }))
        );
      }
    } catch {
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(undefined);
    setMessages([]);
    setInputValue('');
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await aiApiService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        handleNewChat();
      }
      toast.success('Conversation cleared');
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputValue).trim();
    if (!prompt || isLoading) return;

    const tempUserMessage: AiMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId || '',
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiApiService.sendMessage({
        message: prompt,
        conversationId: activeConversationId,
      });

      setActiveConversationId(response.conversationId);

      const assistantMsg = {
        ...response.message,
        structuredCards: response.structuredCards,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      loadConversations();
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message || err?.message;

      let errorDisplay = 'Sorry, I encountered an issue connecting with the AI service.';
      if (status === 401) {
        errorDisplay = 'You are currently not logged in (or your session expired). Please log in with your salon account at /login so the assistant can securely access your salon data.';
      } else if (backendMessage) {
        errorDisplay = `AI Service Notice: ${backendMessage}`;
      }

      toast.error(backendMessage || 'Error communicating with AI assistant');
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          conversationId: activeConversationId || '',
          role: 'model',
          content: errorDisplay,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const availableTasks = [
    {
      label: "Today's Revenue",
      shortLabel: "Revenue",
      icon: <Banknote size={14} color="#10b981" />,
      query: "How much revenue did we make today?",
      description: "Sales, payment breakdown & tickets",
    },
    {
      label: "Staff on Duty",
      shortLabel: "Staff Duty",
      icon: <Users size={14} color="#0ea5e9" />,
      query: "Who is on duty right now?",
      description: "Attendance, active stylists & leaves",
    },
    {
      label: "Today's Appointments",
      shortLabel: "Appointments",
      icon: <Calendar size={14} color="#6366f1" />,
      query: "What are our appointments for today?",
      description: "Upcoming client bookings & schedule",
    },
    {
      label: "Services & Pricing",
      shortLabel: "Services",
      icon: <Scissors size={14} color="#f59e0b" />,
      query: "What services do we offer and at what price?",
      description: "Browse catalog, duration & rates",
    },
    {
      label: "Book Appointment",
      shortLabel: "Book Client",
      icon: <Plus size={14} color="#ec4899" />,
      query: "I want to book an appointment for a client",
      description: "Schedule a client with a stylist",
    },
  ];

  return (
    <Fade in={open} mountOnEnter unmountOnExit timeout={280}>
      <Paper
        elevation={24}
        sx={{
          position: 'fixed',
          top: isExpanded ? { xs: 76, sm: 86 } : 'auto',
          bottom: isExpanded ? { xs: 12, sm: 20 } : { xs: 16, sm: 24 },
          right: isExpanded ? { xs: 12, sm: 24 } : { xs: 16, sm: 24 },
          width: isExpanded ? { xs: 'calc(100vw - 24px)', sm: 560 } : { xs: 'calc(100vw - 32px)', sm: 430 },
          height: isExpanded ? 'auto' : { xs: 'calc(100vh - 115px)', sm: 520 },
          maxHeight: isExpanded ? 'calc(100vh - 106px)' : 'calc(100vh - 115px)',
          borderRadius: '22px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1600,
          backdropFilter: 'blur(28px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.97)',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(99, 102, 241, 0.2)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 24px 60px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.25)'
              : '0 24px 60px -12px rgba(99, 102, 241, 0.28), 0 0 0 1px rgba(99, 102, 241, 0.15)',
          transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 1. Sleek Header */}
        <Box
          sx={{
            px: 2.2,
            py: 1.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.12)',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.12) 100%)'
                : 'linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(243, 244, 246, 0.95) 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.2 }}>
                Salon Copilot
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', fontWeight: 500 }}>
                  Gemini 3.5 Flash Lite • Operations
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <Tooltip title="New Conversation">
              <IconButton size="small" onClick={handleNewChat} sx={{ color: 'text.secondary', p: 0.8 }}>
                <Plus size={17} />
              </IconButton>
            </Tooltip>
            <Tooltip title={isExpanded ? 'Restore window size' : 'Expand window'}>
              <IconButton
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{ color: 'text.secondary', p: 0.8, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary', p: 0.8 }}>
                <X size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 2. Chat Feed */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2.2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.8,
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(99, 102, 241, 0.25) transparent',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(99, 102, 241, 0.25)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-button': {
              display: 'none',
              width: 0,
              height: 0,
            },
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                py: 3,
                px: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  mb: 1.8,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                }}
              >
                <Bot size={28} color="#ffffff" />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                How can I assist your salon today?
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300, mb: 3, fontSize: '0.82rem' }}>
                Ask about today&apos;s revenue, staff attendance, client bookings, or book appointments instantly.
              </Typography>

              {/* Suggestions Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, width: '100%', maxWidth: 380 }}>
                {availableTasks.map((q, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleSendMessage(q.query)}
                    sx={{
                      p: 1.3,
                      borderRadius: '14px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.14)',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: '#6366f1',
                        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ p: 0.6, borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.08)', display: 'flex' }}>
                      {q.icon}
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem', textAlign: 'left', lineHeight: 1.2 }}>
                      {q.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      maxWidth: '92%',
                      alignItems: 'flex-start',
                    }}
                  >
                    {!isUser && (
                      <Avatar
                        sx={{
                          width: 26,
                          height: 26,
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        <Sparkles size={13} color="#ffffff" />
                      </Avatar>
                    )}

                    <Box>
                      <Box
                        sx={{
                          p: 1.4,
                          px: 1.8,
                          borderRadius: 2.5,
                          borderTopRightRadius: isUser ? 0 : 2.5,
                          borderTopLeftRadius: !isUser ? 0 : 2.5,
                          background: (theme) =>
                            isUser
                              ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
                              : theme.palette.mode === 'dark'
                              ? 'rgba(30, 41, 59, 0.85)'
                              : '#f8fafc',
                          color: (theme) => (isUser ? '#ffffff' : theme.palette.text.primary),
                          boxShadow: isUser
                            ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                            : '0 1px 3px rgba(0, 0, 0, 0.05)',
                          border: isUser
                            ? 'none'
                            : (theme) =>
                                theme.palette.mode === 'dark'
                                  ? '1px solid rgba(255,255,255,0.06)'
                                  : '1px solid rgba(99, 102, 241, 0.1)',
                          wordBreak: 'break-word',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {isUser ? msg.content : <MarkdownText content={msg.content} />}
                      </Box>

                      {/* Structured Cards */}
                      {!isUser && msg.structuredCards && msg.structuredCards.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {msg.structuredCards.map((card, idx) => (
                            <AiToolCard key={idx} name={card.name} result={card.result} />
                          ))}
                        </Box>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.4,
                          fontSize: '0.65rem',
                          color: 'text.secondary',
                          textAlign: isUser ? 'right' : 'left',
                          px: 0.5,
                        }}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}

          {/* Thinking / Calling Tools State */}
          {isLoading && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 0.5 }}>
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                <Sparkles size={13} color="#ffffff" />
              </Avatar>
              <Box
                sx={{
                  p: 1.2,
                  px: 1.6,
                  borderRadius: 2.5,
                  borderTopLeftRadius: 0,
                  backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <CircularProgress size={13} sx={{ color: '#6366f1' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                  Analyzing live salon data...
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Quick Task Chips Bar (Always visible during active conversation) */}
        {messages.length > 0 && (
          <Box
            sx={{
              px: 1.8,
              py: 0.8,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              overflowX: 'auto',
              borderTop: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.1)',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(248, 250, 252, 0.9)',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                color: 'text.secondary',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
                flexShrink: 0,
                mr: 0.2,
              }}
            >
              <Zap size={12} color="#6366f1" /> Quick:
            </Typography>
            {availableTasks.map((task, idx) => (
              <Chip
                key={idx}
                icon={task.icon}
                label={task.shortLabel}
                size="small"
                onClick={() => handleSendMessage(task.query)}
                disabled={isLoading}
                sx={{
                  flexShrink: 0,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  height: 24,
                  cursor: 'pointer',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
                  border: '1px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.15)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    borderColor: '#6366f1',
                    boxShadow: '0 2px 6px rgba(99, 102, 241, 0.2)',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* 3. Floating Bottom Input Bar */}
        <Box
          sx={{
            p: 1.6,
            px: 2,
            borderTop: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.1)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc',
              borderRadius: '20px',
              p: 0.5,
              px: 1.2,
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.15)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
              '&:focus-within': {
                borderColor: '#6366f1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
              },
            }}
          >
            {/* Quick Task Menu Picker Button */}
            <Tooltip title="Pick a Quick Task">
              <IconButton
                size="small"
                onClick={(e) => setTaskMenuAnchor(e.currentTarget)}
                sx={{
                  p: 0.7,
                  color: Boolean(taskMenuAnchor) ? '#6366f1' : 'text.secondary',
                  backgroundColor: Boolean(taskMenuAnchor)
                    ? 'rgba(99, 102, 241, 0.12)'
                    : 'transparent',
                  '&:hover': {
                    color: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  },
                }}
              >
                <Zap size={16} />
              </IconButton>
            </Tooltip>

            <InputBase
              fullWidth
              placeholder="Ask about revenue, staff, or appointments..."
              multiline
              maxRows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ fontSize: '0.875rem', py: 0.5 }}
            />
            <IconButton
              color="primary"
              disabled={!inputValue.trim() || isLoading}
              onClick={() => handleSendMessage()}
              sx={{
                background: inputValue.trim() && !isLoading ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : undefined,
                color: inputValue.trim() && !isLoading ? '#ffffff' : undefined,
                width: 32,
                height: 32,
                flexShrink: 0,
                boxShadow: inputValue.trim() && !isLoading ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Send size={15} />
            </IconButton>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 0.8,
              color: 'text.secondary',
              fontSize: '0.67rem',
              letterSpacing: '0.02em',
            }}
          >
            Salon Copilot • Multi-tenant intelligence powered by Gemini
          </Typography>
        </Box>

        {/* Floating Quick Tasks Menu */}
        <Menu
          anchorEl={taskMenuAnchor}
          open={Boolean(taskMenuAnchor)}
          onClose={() => setTaskMenuAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              elevation: 16,
              sx: {
                mb: 1.2,
                borderRadius: '16px',
                minWidth: 270,
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.15)',
                background: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.84rem' }}>
              Select a Task
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              Run instantly in current conversation
            </Typography>
          </Box>
          {availableTasks.map((task, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setTaskMenuAnchor(null);
                handleSendMessage(task.query);
              }}
              sx={{
                py: 1.2,
                px: 2,
                gap: 1.4,
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.14)' : 'rgba(99, 102, 241, 0.07)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', p: 0.6, borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>
                {task.icon}
              </ListItemIcon>
              <ListItemText
                primary={task.label}
                secondary={task.description}
                primaryTypographyProps={{ fontWeight: 700, fontSize: '0.82rem' }}
                secondaryTypographyProps={{ fontSize: '0.7rem' }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Fade>
  );
};
