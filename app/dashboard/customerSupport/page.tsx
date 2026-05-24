'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  LogIn, 
  Home, 
  Building,
  TrendingUp,
  UserPlus,
  MessageCircle,
  LogOut,
  Search,
  X,
  MoreVertical,
  Circle,
  Send,
  Paperclip,
  Smile,
  Mic
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { colors } from '../../utils/colors';
import { fetchChats, Chat, formatTimestamp, getUserInitials } from '../../api/customerSupport';

export default function CustomerSupport() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redux state
  const { user } = useAppSelector(state => state.auth as any);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!user) {
      router.push('/authScreens');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    // Fetch chats from Firestore
    const loadChats = async () => {
      try {
        const response = await fetchChats();
        if (response.success && response.chats) {
          setChats(response.chats);
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.userFullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.creamBackground }}>
      {/* Floating Sidebar */}
      <div className="fixed z-50 w-64 floating-island rounded-card hover-lift transform translate-x-0"
           style={{ 
             height: '70vh', 
             left: '2.4%', 
             top: '13.6%',
             backgroundColor: colors.cardBackground 
           }}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: colors.primarySage }}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Homesty</span>
          </div>
        </div>
        
        <div className="flex flex-col h-full">
          <nav className="mt-8 px-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 8rem)' }}>
            <a href="/dashboard/basicUserData" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 mt-1">
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a href="/dashboard/customerSupport" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700">
              <MessageCircle className="mr-3 h-5 w-5" />
              Customer support
            </a>
          </nav>
          
          {/* Sign Out Button at Bottom */}
          <div className="px-4 pb-4 mt-auto">
            <button 
              onClick={() => router.push('/authScreens')}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Dashboard Content */}
        <main className="p-6" style={{ marginLeft: '18%' }}>
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
              <p className="text-gray-600 mt-2">Manage customer conversations and provide support</p>
            </div>

            {/* Chat Interface */}
            <div className="floating-island rounded-card hover-lift overflow-hidden" 
                 style={{ height: '70vh' }}>
              <div className="flex h-full">
                {/* Chat List */}
                <div className="w-96 border-r border-gray-200 flex flex-col">
                  {/* Search Bar */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                      </div>
                    ) : (
                      filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => handleChatSelect(chat)}
                          className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                            selectedChat?.id === chat.id 
                              ? 'bg-purple-50 border-purple-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md" 
                                 style={{ backgroundColor: colors.primarySage }}>
                              {getUserInitials(chat.userFullName)}
                            </div>
                            {chat.isUserActive && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 ml-4">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">{chat.userFullName}</h4>
                              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {formatTimestamp(chat.lastMessageTimestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unreadMessagesAsHomesty > 0 && (
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold ml-3 flex-shrink-0">
                              {chat.unreadMessagesAsHomesty}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {filteredChats.length === 0 && !loading && (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-center">No chats found</p>
                        <p className="text-gray-400 text-sm text-center mt-1">Try searching for different keywords</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Area */}
                <div className="flex-1 flex flex-col">
                  {selectedChat ? (
                    <>
                      {/* Chat Header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md" 
                               style={{ backgroundColor: colors.primarySage }}>
                            {getUserInitials(selectedChat.userFullName)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{selectedChat.userFullName}</h3>
                            <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
                              <Circle className="w-2 h-2 fill-current" />
                              {selectedChat.isUserActive ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedChat.messages?.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-sm px-4 py-2 rounded-2xl shadow-sm ${
                                msg.sender === 'user'
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-white text-gray-800 border border-gray-200'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              <p className={`text-xs mt-1 ${
                                msg.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                              }`}>
                                {formatTimestamp(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {(!selectedChat.messages || selectedChat.messages.length === 0) && (
                          <div className="text-center text-gray-500 text-sm">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                      </div>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Paperclip className="h-5 w-5" />
                          </button>
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Smile className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Mic className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="p-2 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: colors.primarySage }}
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Empty State */
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" 
                             style={{ backgroundColor: colors.primarySage + '20' }}>
                          <MessageCircle className="h-10 w-10" style={{ color: colors.primarySage }} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                        <p className="text-gray-600 text-sm">
                          Choose a chat from the left to start messaging
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
