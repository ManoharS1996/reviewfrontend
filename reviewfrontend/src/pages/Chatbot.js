import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Avatar,
  Fade,
  Slide,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  AccountCircle as UserIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Floating animation for the chatbot button
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const ChatbotButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: 60,
  height: 60,
  backgroundColor: '#ff4081',
  color: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: '#e91e63',
    transform: 'scale(1.05)'
  },
  animation: `${float} 3s ease-in-out infinite`,
  zIndex: 1000
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: theme.spacing(2),
  width: 380,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  borderRadius: '16px',
  overflow: 'hidden',
  zIndex: 999,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,247,250,0.98) 100%)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.3)'
}));

const MessageBubble = styled(Box)(({ isUser, theme }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5, 2),
  margin: theme.spacing(1, 1.5),
  borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser 
    ? 'linear-gradient(135deg, #1976d2, #2196f3)' 
    : 'linear-gradient(135deg, #ff4081, #e91e63)',
  background: isUser 
    ? 'linear-gradient(135deg, #1976d2, #2196f3)' 
    : 'linear-gradient(135deg, #ff4081, #e91e63)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
  wordWrap: 'break-word',
  position: 'relative'
}));

const QuickReplies = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderTop: '1px solid rgba(0,0,0,0.1)',
  background: 'rgba(245, 247, 250, 0.8)'
}));

// Female assistant avatar with gradient
const FemaleAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  background: 'linear-gradient(135deg, #ff4081, #e91e63)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
}));

// Intelligent response system
const getBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // Registration related queries
  if (message.includes('register') || message.includes('sign up') || message.includes('account') || message.includes('signup')) {
    return {
      text: "You can register for an account by clicking on the 'Register' link in the navigation menu or visiting the registration page directly.",
      quickReplies: ['Where is register?', 'Login help', 'Forgot password?']
    };
  }
  
  // Login related queries
  if (message.includes('login') || message.includes('sign in') || message.includes('log in') || message.includes('signin')) {
    return {
      text: "You can login using your username and password on the login page. If you've forgotten your password, there's a 'Forgot Password' option available.",
      quickReplies: ['Registration', 'Reset password', 'Contact support']
    };
  }
  
  // Schedule related queries
  if (message.includes('schedule') || message.includes('deployment') || message.includes('deploy')) {
    return {
      text: "The Schedule page allows you to create and manage deployment schedules. You can set dates, time slots, assign developers, and track deployment status.",
      quickReplies: ['Create schedule', 'View schedules', 'Time slots']
    };
  }
  
  // Updates related queries
  if (message.includes('update') || message.includes('feature') || message.includes('release')) {
    return {
      text: "The Updates page shows all application updates and feature releases. You can track what features were added and when they were deployed.",
      quickReplies: ['Recent updates', 'Add update', 'Feature tracking']
    };
  }
  
  // Reviews related queries
  if (message.includes('review') || message.includes('feedback') || message.includes('rating')) {
    return {
      text: "The Reviews section contains feedback and ratings for deployed applications. You can add reviews, read feedback, and see recommendations.",
      quickReplies: ['Add review', 'View reviews', 'Rating system']
    };
  }
  
  // Help and support queries
  if (message.includes('help') || message.includes('support') || message.includes('problem') || message.includes('issue')) {
    return {
      text: "I'm here to help! You can ask me about registration, login, scheduling deployments, tracking updates, or reviewing applications. What do you need help with?",
      quickReplies: ['Registration help', 'Login issues', 'Schedule problem']
    };
  }
  
  // Greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greeting')) {
    return {
      text: "Hello! I'm Ava, your deployment assistant. How can I help you with deployment scheduling and management today?",
      quickReplies: ['Registration', 'Login', 'Schedule help']
    };
  }
  
  // Default response
  const defaultResponses = [
    "I can help you with deployment scheduling, updates tracking, and application reviews. What would you like to know?",
    "I specialize in deployment management. You can ask me about scheduling, updates, reviews, or account management.",
    "I'm here to assist with your deployment system. How can I help you today?"
  ];
  
  return {
    text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    quickReplies: ['Registration', 'Login', 'Schedule', 'Updates', 'Reviews']
  };
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi there! 👋 I'm Ava, your deployment assistant. I can help you with scheduling, updates, reviews, and account management. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Get intelligent bot response
    setTimeout(() => {
      const response = getBotResponse(inputText);
      const botMessage = {
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        quickReplies: response.quickReplies
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  // Handle quick reply click
  const handleQuickReply = (reply) => {
    setInputText(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <Fade in={!isOpen} timeout={500}>
        <ChatbotButton onClick={toggleChat}>
          <BotIcon fontSize="large" />
        </ChatbotButton>
      </Fade>

      {/* Chat window */}
      <Slide in={isOpen} direction="up" timeout={300}>
        <ChatWindow>
          {/* Header */}
          <Box 
            sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #ff4081, #e91e63)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FemaleAvatar sx={{ mr: 1.5 }}>
                <BotIcon />
              </FemaleAvatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Ava</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Deployment Assistant</Typography>
              </Box>
            </Box>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }} 
              onClick={toggleChat}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages area */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              p: 2,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexDirection: message.isUser ? 'row-reverse' : 'row' }}>
                {!message.isUser && (
                  <FemaleAvatar sx={{ mr: 1.5, mt: 0.5 }}>
                    <BotIcon />
                  </FemaleAvatar>
                )}
                {message.isUser && (
                  <Avatar sx={{ ml: 1.5, mt: 0.5, bgcolor: '#1976d2', width: 32, height: 32 }}>
                    <UserIcon />
                  </Avatar>
                )}
                <MessageBubble isUser={message.isUser}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{message.text}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: 'right',
                      opacity: 0.8,
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </MessageBubble>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick replies */}
          {messages.length > 0 && messages[messages.length - 1].quickReplies && !messages[messages.length - 1].isUser && (
            <QuickReplies>
              {messages[messages.length - 1].quickReplies.map((reply, index) => (
                <Chip
                  key={index}
                  label={reply}
                  size="small"
                  onClick={() => handleQuickReply(reply)}
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2, #2196f3)',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0, #1976d2)'
                    }
                  }}
                />
              ))}
            </QuickReplies>
          )}

          {/* Input area */}
          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              background: 'white'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message here..."
              size="small"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ 
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  background: '#f5f7fa'
                }
              }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              sx={{
                background: 'linear-gradient(135deg, #ff4081, #e91e63)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e91e63, #d81b60)'
                },
                '&.Mui-disabled': {
                  background: '#ccc'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </ChatWindow>
      </Slide>
    </>
  );
};

export default Chatbot;