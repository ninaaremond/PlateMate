// hey, this is the AI nutritional coach screen where users can chat with an AI assistant
// it helps them with meal planning, nutrition advice, and general dietary questions
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Groq from 'groq-sdk';

// setting up the Groq AI client with our API key
const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true // needed for react native
});

// system prompt that tells the AI how to behave - it's a nutrition coach for PlateMate
const systemPrompt = `You are a friendly AI nutritional coach for PlateMate, a meal planning app.

YOUR ROLE:
- Help users with meal planning, nutrition advice, and dietary questions
- Provide practical, actionable tips for healthy eating
- Answer questions about calories, macros, and food choices
- Support various diet preferences (vegan, vegetarian, balanced)
- Encourage healthy habits and positive relationship with food

INSTRUCTIONS:
- Be FRIENDLY and SUPPORTIVE
- Keep responses CONCISE (2-4 sentences max)
- Use emojis to make responses engaging 😊
- Give PRACTICAL advice users can apply immediately
- If asked about medical conditions, suggest consulting a healthcare professional
- Focus on sustainable, balanced nutrition

STYLE:
- Conversational and warm
- Encouraging but realistic
- Maximum 80 words per response
- Use simple language, avoid jargon`;

export default function AICoachScreen({ onBack, userData }) {
  // keeping track of all the chat messages between user and AI
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${userData?.name || 'there'}! 👋 I'm your PlateMate nutrition coach. How can I help you today with your meal planning or nutrition goals? 🥗`,
      timestamp: new Date().toISOString()
    }
  ]);
  
  // current text the user is typing
  const [inputText, setInputText] = useState('');
  
  // whether we're waiting for AI to respond
  const [isLoading, setIsLoading] = useState(false);
  
  // reference to scroll view so we can auto-scroll to bottom when new messages arrive
  const scrollViewRef = useRef();

  // auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // this function sends the user's message to Groq AI and gets a response
  const sendMessage = async () => {
    // don't send empty messages
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    // add user message to chat right away
    setMessages(prev => [...prev, userMessage]);
    setInputText(''); // clear input
    setIsLoading(true); // show loading indicator

    try {
      // prepare messages for the AI (exclude timestamps)
      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage.content }
      ];

      // call Groq API with Llama model
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: chatMessages,
        temperature: 0.7, // a bit creative but still focused
        max_completion_tokens: 200,
        top_p: 1,
        stream: false
      });

      // extract AI's response
      const aiResponse = completion.choices[0]?.message?.content || 
        "Sorry, I couldn't process that. Could you rephrase your question? 🤔";

      // add AI response to chat
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('AI Coach Error:', error);
      
      // show friendly error message
      const errorMessage = {
        role: 'assistant',
        content: "Oops! I'm having trouble connecting right now. Please try again in a moment. 🔄",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}
    >
      {/* header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🤖 Nutrition Coach</Text>
        <View style={styles.placeholder} />
      </View>

      {/* chat messages area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.aiBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              message.role === 'user' ? styles.userText : styles.aiText
            ]}>
              {message.content}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}
        
        {/* loading indicator when AI is thinking */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* input area at the bottom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me about nutrition, meals, recipes..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffe2ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
    borderBottomWidth: 1,
    borderBottomColor: '#45a049',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50, // balances the header
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffcde7ff',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#f08cc0ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
