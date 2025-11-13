import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ThumbsUp, ThumbsDown, Send, Smile, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses: { [key: string]: string } = {
  'dự án': 'Bạn có thể quản lý dự án trong tab "Dự án". Tại đây bạn có thể tạo, chỉnh sửa, xóa dự án và theo dõi tiến độ của từng dự án.',
  'công việc': 'Trong tab "Công việc", bạn có thể tạo công việc mới, gán người thực hiện, đặt độ ưu tiên và theo dõi trạng thái. Người tạo công việc sẽ tự động được gán làm người thực hiện.',
  'lịch trình': 'Tab "Lịch trình" giúp bạn xem tổng quan lịch trình các công việc và dự án theo thời gian. Bạn có thể lọc theo dự án, trạng thái để dễ dàng theo dõi.',
  'nhóm': 'Trong tab "Nhóm", bạn có thể xem danh sách thành viên, bảng xếp hạng công việc hoàn thành trong tháng và quản lý thông tin của từng thành viên.',
  'báo cáo': 'Tab "Báo cáo" (đang phát triển) sẽ cung cấp các thống kê chi tiết về hiệu suất làm việc, tiến độ dự án và năng suất của nhóm.',
  'tổng quan': 'Dashboard "Tổng quan" hiển thị các chỉ số quan trọng như số lượng dự án, công việc, tỷ lệ hoàn thành và các biểu đồ trực quan.',
  'cài đặt': 'Trong "Cài đặt", bạn có thể tùy chỉnh giao diện, cài đặt thông báo, thay đổi ngôn ngữ và quản lý bảo mật tài khoản.',
  'phân quyền': 'Hệ thống có 2 loại tài khoản: Quản lý (toàn quyền) và Nhân viên (quyền hạn giới hạn). Quản lý có thể tạo, sửa, xóa tất cả dữ liệu.',
  'xóa': 'Bạn có thể xóa dự án hoặc công việc bằng cách nhấn vào nút menu (3 chấm) và chọn "Xóa". Lưu ý: thao tác này không thể hoàn tác!',
  'chỉnh sửa': 'Để chỉnh sửa dự án hoặc công việc, nhấn vào nút menu (3 chấm) và chọn "Chỉnh sửa". Bạn có thể thay đổi mọi thông tin trừ người tạo.',
  'trạng thái': 'Có 4 trạng thái công việc: Chờ xử lý (màu vàng), Đang thực hiện (xanh dương), Hoàn thành (xanh lá), Trì hoãn (đỏ).',
  'độ ưu tiên': 'Có 3 mức độ ưu tiên: Thấp (màu xám), Trung bình (vàng), Cao (đỏ). Điều này giúp bạn sắp xếp công việc theo mức độ quan trọng.',
  'default': 'Xin chào! Tôi là Bot hỗ trợ. Tôi có thể giúp bạn về:\n• Quản lý dự án\n• Quản lý công việc\n• Lịch trình\n• Nhóm và phân quyền\n• Cài đặt\n\nHãy hỏi tôi bất kỳ điều gì! 😊',
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Chào mừng bạn đến với hệ thống quản lý dự án!\n\nVui lòng để lại lời nhắn nếu có bất kỳ thắc mắc nào liên quan đến sản phẩm và dịch vụ. Mình luôn sẵn sàng hỗ trợ! 😊',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Tìm từ khóa phù hợp
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Câu hỏi chung
    if (lowerMessage.includes('làm') || lowerMessage.includes('cách') || lowerMessage.includes('như thế nào')) {
      return 'Bạn có thể cho tôi biết cụ thể hơn về vấn đề bạn cần hỗ trợ không? Tôi có thể giúp về dự án, công việc, lịch trình, nhóm, hoặc cài đặt.';
    }
    
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks')) {
      return 'Rất vui được hỗ trợ bạn! Nếu có thêm thắc mắc, đừng ngần ngại hỏi tôi nhé! 😊';
    }
    
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?';
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        dislikedMessages.delete(messageId);
      }
      return newSet;
    });
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  const handleDislike = (messageId: string) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        likedMessages.delete(messageId);
      }
      return newSet;
    });
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 z-50 p-0"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-white">
                <div className="flex items-center justify-center h-full w-full">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                </div>
              </Avatar>
              <div>
                <p className="text-white">Bot hỗ trợ</p>
                <p className="text-xs text-blue-100">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                        <div className="flex items-center justify-center h-full w-full">
                          <MessageCircle className="h-4 w-4 text-white" />
                        </div>
                      </Avatar>
                    )}
                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-4 py-2 whitespace-pre-line ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.sender === 'bot' && (
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => handleLike(message.id)}
                            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                              likedMessages.has(message.id) ? 'text-blue-500' : 'text-gray-400'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDislike(message.id)}
                            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                              dislikedMessages.has(message.id) ? 'text-red-500' : 'text-gray-400'
                            }`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Footer with branding */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <span>Powered by</span>
              <span className="font-semibold text-blue-500">TeamFlow AI</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-0"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
