import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LayoutDashboard, Bell, Settings, LogOut, HelpCircle, Menu, X, Users, Check, XIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { UserData } from './AuthPage';
import { useData } from './DataContext';
import { toast } from 'sonner@2.0.3';

interface HeaderProps {
  user: UserData;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export function Header({ user, onNavigateToSettings, onLogout }: HeaderProps) {
  const { invitations, acceptInvitation, rejectInvitation } = useData();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<number | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberSkills, setMemberSkills] = useState('');

  const userInvitations = invitations.filter(
    inv => inv.invitedEmail === user.email && inv.status === 'pending'
  );
  const notificationCount = userInvitations.length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAcceptInvitation = (invitationId: number) => {
    setSelectedInvitation(invitationId);
    setShowAcceptDialog(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedInvitation || !memberName.trim() || !memberRole.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const initials = memberName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);

    const memberData = {
      id: Date.now(),
      name: memberName,
      role: memberRole,
      email: user.email,
      phone: memberPhone,
      avatar: initials,
      status: 'online' as const,
      skills: memberSkills.split(',').map(s => s.trim()).filter(Boolean),
    };

    acceptInvitation(selectedInvitation, memberData);
    toast.success('Đã tham gia nhóm thành công!');
    setShowAcceptDialog(false);
    setSelectedInvitation(null);
    setMemberName('');
    setMemberRole('');
    setMemberPhone('');
    setMemberSkills('');
  };

  const handleRejectInvitation = (invitationId: number) => {
    if (confirm('Bạn có chắc chắn muốn từ chối lời mời này?')) {
      rejectInvitation(invitationId);
      toast.success('Đã từ chối lời mời!');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-xl">TaskFlow</h1>
                <p className="text-xs text-gray-500">Quản lý dự án</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Info */}
            <div className="text-right mr-2">
              <p className="text-sm text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.company}</p>
            </div>

            {/* Settings */}
            <Button variant="ghost" size="icon" onClick={onNavigateToSettings}>
              <Settings className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96">
                <div className="px-3 py-2 border-b border-gray-200">
                  <h3 className="text-sm">Thông báo</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {userInvitations.length > 0 ? (
                    <>
                      {userInvitations.map((invitation) => {
                        const senderInitials = invitation.invitedBy
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2);
                        
                        return (
                          <div key={invitation.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                              {/* Sender Avatar */}
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 text-white">
                                  {senderInitials}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                {/* Invitation Message */}
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">
                                      <span className="font-semibold text-gray-900">{invitation.invitedBy}</span>
                                      {' '}đã mời bạn tham gia nhóm{' '}
                                    </p>
                                    {/* Team Badge */}
                                    <div className="flex items-center gap-2 mt-1">
                                      <div
                                        className="w-6 h-6 rounded flex items-center justify-center"
                                        style={{ backgroundColor: invitation.teamColor }}
                                      >
                                        <Users className="w-3 h-3 text-white" />
                                      </div>
                                      <span className="font-semibold text-gray-900">{invitation.teamName}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Time */}
                                <p className="text-xs text-gray-500 mb-3">
                                  {new Date(invitation.createdAt).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="h-8 px-3 text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcceptInvitation(invitation.id);
                                    }}
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Chấp nhận
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRejectInvitation(invitation.id);
                                    }}
                                  >
                                    <XIcon className="w-3 h-3 mr-1" />
                                    Từ chối
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Chưa có gì mới</p>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help */}
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-5 h-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.role && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {user.role}
                    </Badge>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Trung tâm trợ giúp
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onNavigateToSettings();
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Thông báo
                  {notificationCount > 0 && (
                    <Badge className="ml-auto">{notificationCount}</Badge>
                  )}
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Trợ giúp
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onLogout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accept Invitation Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hoàn tất thông tin để tham gia nhóm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accept-name">Họ và tên</Label>
              <Input
                id="accept-name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label htmlFor="accept-role">Vai trò</Label>
              <Input
                id="accept-role"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                placeholder="Frontend Developer"
              />
            </div>
            <div>
              <Label htmlFor="accept-phone">Số điện thoại (tùy chọn)</Label>
              <Input
                id="accept-phone"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                placeholder="0901234567"
              />
            </div>
            <div>
              <Label htmlFor="accept-skills">Kỹ năng (phân cách bằng dấu phẩy, tùy chọn)</Label>
              <Input
                id="accept-skills"
                value={memberSkills}
                onChange={(e) => setMemberSkills(e.target.value)}
                placeholder="React, TypeScript, Tailwind CSS"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmAccept}>
                Xác nhận tham gia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
