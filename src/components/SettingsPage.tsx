import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { User, Mail, Phone, Building, Lock, Bell, Shield, Palette, Globe, Moon, Sun, Monitor, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { UserData } from './AuthPage';

interface SettingsPageProps {
  user: UserData;
  onUpdateUser: (userData: UserData) => void;
}

export function SettingsPage({ user, onUpdateUser }: SettingsPageProps) {
  const [formData, setFormData] = useState(user);
  
  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  
  // Display settings
  const [fontSize, setFontSize] = useState(16);
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  
  // Language & Region
  const [language, setLanguage] = useState('vi');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');
  
  // Privacy settings
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    toast.success('Thông tin tài khoản đã được cập nhật!');
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveSettings = () => {
    // Apply font size to root
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    
    toast.success('Đã lưu cài đặt thành công!');
  };

  const handleResetSettings = () => {
    setTheme('light');
    setAccentColor('#3b82f6');
    setFontSize(16);
    setCompactMode(false);
    setSidebarCollapsed(false);
    setEmailNotifications(true);
    setPushNotifications(true);
    setTaskReminders(true);
    setProjectUpdates(true);
    setLanguage('vi');
    setDateFormat('DD/MM/YYYY');
    setTimeFormat('24h');
    setShowOnlineStatus(true);
    setAllowAnalytics(false);
    
    document.documentElement.style.setProperty('--font-size', '16px');
    
    toast.success('Đã đặt lại cài đặt về mặc định!');
  };

  const accentColors = [
    { name: 'Xanh dương', value: '#3b82f6' },
    { name: 'Xanh lá', value: '#10b981' },
    { name: 'Tím', value: '#8b5cf6' },
    { name: 'Hồng', value: '#ec4899' },
    { name: 'Cam', value: '#f59e0b' },
    { name: 'Đỏ', value: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Cài đặt tài khoản</h2>
        <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và tùy chỉnh giao diện</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-gray-900">{formData.name}</h3>
              <p className="text-gray-600 mb-2">{formData.email}</p>
              <Button variant="outline" size="sm">
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Giao diện
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="w-4 h-4 mr-2" />
            Ngôn ngữ
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="w-4 h-4 mr-2" />
            Riêng tư
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Vai trò</Label>
                    <Input
                      id="role"
                      value={formData.role || ''}
                      onChange={(e) => handleChange('role', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="company">Công ty</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="company"
                        value={formData.company || ''}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="submit">
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={() => toast.success('Mật khẩu đã được cập nhật!')}
              >
                Cập nhật mật khẩu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xác thực hai yếu tố (2FA)</CardTitle>
              <CardDescription>Tăng cường bảo mật tài khoản với xác thực hai yếu tố</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                Kích hoạt 2FA
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phiên đăng nhập</CardTitle>
              <CardDescription>Quản lý các thiết bị đã đăng nhập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm">Windows - Chrome</p>
                    <p className="text-xs text-gray-500">Hà Nội, Việt Nam • Hiện tại</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Phiên hiện tại
                  </Button>
                </div>
              </div>
              <Button variant="destructive" className="mt-4" size="sm">
                Đăng xuất tất cả thiết bị khác
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo Email</CardTitle>
              <CardDescription>Quản lý thông báo qua email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bật thông báo email</Label>
                  <p className="text-sm text-gray-600">Nhận thông báo quan trọng qua email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Được giao công việc mới</p>
                  <p className="text-xs text-gray-500">Nhận email khi được giao việc</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" aria-label="Được giao công việc mới" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Deadline sắp đến</p>
                  <p className="text-xs text-gray-500">Nhắc nhở trước 1 ngày</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" aria-label="Deadline sắp đến" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Bình luận mới</p>
                  <p className="text-xs text-gray-500">Thông báo khi có người bình luận</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" aria-label="Bình luận mới" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Cập nhật dự án</p>
                  <p className="text-xs text-gray-500">Thông báo thay đổi trong dự án</p>
                </div>
                <input type="checkbox" className="rounded" aria-label="Cập nhật dự án" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông báo đẩy</CardTitle>
              <CardDescription>Nhận thông báo trực tiếp trên trình duyệt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bật thông báo đẩy</Label>
                  <p className="text-sm text-gray-600">Nhận thông báo ngay lập tức</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Tin nhắn mới</p>
                  <p className="text-xs text-gray-500">Hiển thị badge khi có tin nhắn</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" aria-label="Tin nhắn mới" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Nhắc nhở hàng ngày</p>
                  <p className="text-xs text-gray-500">Tóm tắt công việc mỗi sáng</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" aria-label="Nhắc nhở hàng ngày" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loại thông báo</CardTitle>
              <CardDescription>Chọn loại thông báo muốn nhận</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở công việc</Label>
                  <p className="text-sm text-gray-600">Thông báo khi công việc sắp đến hạn</p>
                </div>
                <Switch checked={taskReminders} onCheckedChange={setTaskReminders} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cập nhật dự án</Label>
                  <p className="text-sm text-gray-600">Thông báo khi có thay đổi trong dự án</p>
                </div>
                <Switch checked={projectUpdates} onCheckedChange={setProjectUpdates} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chế độ hiển thị</CardTitle>
              <CardDescription>Chọn giao diện sáng, tối hoặc tự động theo hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <Sun className="w-8 h-8" />
                  <span className="text-sm">Sáng</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <Moon className="w-8 h-8" />
                  <span className="text-sm">Tối</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${theme === 'system' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <Monitor className="w-8 h-8" />
                  <span className="text-sm">Tự động</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Màu chủ đạo</CardTitle>
              <CardDescription>Chọn màu chính cho giao diện ứng dụng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`
                      h-16 rounded-lg transition-all border-2
                      ${accentColor === color.value ? 'border-gray-900 scale-105' : 'border-gray-200'}
                    `}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {accentColor === color.value && (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kích thước chữ</CardTitle>
              <CardDescription>Điều chỉnh kích thước chữ trong ứng dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Kích thước: {fontSize}px</Label>
                <span className="text-sm text-gray-600">Mặc định: 16px</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={12}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Nhỏ (12px)</span>
                <span>Vừa (16px)</span>
                <span>Lớn (20px)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tùy chọn hiển thị</CardTitle>
              <CardDescription>Tùy chỉnh cách hiển thị nội dung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chế độ thu gọn</Label>
                  <p className="text-sm text-gray-600">Giảm khoảng cách giữa các phần tử</p>
                </div>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thu gọn sidebar mặc định</Label>
                  <p className="text-sm text-gray-600">Sidebar sẽ được thu gọn khi mở ứng dụng</p>
                </div>
                <Switch checked={sidebarCollapsed} onCheckedChange={setSidebarCollapsed} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </TabsContent>

        {/* Language & Region Tab */}
        <TabsContent value="language" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ngôn ngữ</CardTitle>
              <CardDescription>Chọn ngôn ngữ hiển thị</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Định dạng ngày tháng</CardTitle>
              <CardDescription>Chọn cách hiển thị ngày tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (18/10/2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (10/18/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-10-18)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Định dạng giờ</CardTitle>
              <CardDescription>Chọn cách hiển thị giờ</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 giờ (14:30)</SelectItem>
                  <SelectItem value="12h">12 giờ (2:30 PM)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quyền riêng tư</CardTitle>
              <CardDescription>Quản lý thông tin cá nhân và quyền riêng tư</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hiển thị trạng thái online</Label>
                  <p className="text-sm text-gray-600">Cho phép người khác thấy bạn đang online</p>
                </div>
                <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép thu thập dữ liệu phân tích</Label>
                  <p className="text-sm text-gray-600">Giúp cải thiện trải nghiệm sử dụng</p>
                </div>
                <Switch checked={allowAnalytics} onCheckedChange={setAllowAnalytics} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bảo mật dữ liệu</CardTitle>
              <CardDescription>Quản lý và bảo vệ dữ liệu của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Tải xuống dữ liệu của tôi
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Xóa tất cả dữ liệu
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Lưu cài đặt
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
