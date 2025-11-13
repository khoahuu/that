import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Mail, 
  Phone, 
  MoreVertical, 
  Users as UsersIcon,
  Plus,
  UserPlus,
  Search,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Folder,
  Calendar,
  Target,
  Settings,
  LogOut,
  Trash2,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Copy,
  Key
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useData, type Team, type TeamMember } from './DataContext';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { UserData } from './AuthPage';
import { MemberProfileDialog } from './MemberProfileDialog';

interface TeamViewProps {
  currentUser: UserData;
}

export function TeamView({ currentUser }: TeamViewProps) {
  const { teams, projects, tasks, addTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam, sendTeamInvitation, joinTeamByCode } = useData();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams.length > 0 ? teams[0] : null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamColor, setTeamColor] = useState('#3b82f6');
  const [inviteEmail, setInviteEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinMemberName, setJoinMemberName] = useState('');
  const [joinMemberRole, setJoinMemberRole] = useState('');
  const [joinMemberPhone, setJoinMemberPhone] = useState('');
  const [joinMemberSkills, setJoinMemberSkills] = useState('');
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const teamColors = [
    { name: 'Xanh dương', value: '#3b82f6' },
    { name: 'Xanh lá', value: '#10b981' },
    { name: 'Tím', value: '#8b5cf6' },
    { name: 'Hồng', value: '#ec4899' },
    { name: 'Cam', value: '#f59e0b' },
    { name: 'Đỏ', value: '#ef4444' },
  ];

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error('Vui lòng nhập tên nhóm!');
      return;
    }

    const newTeam: Omit<Team, 'id'> = {
      name: teamName,
      description: teamDescription,
      color: teamColor,
      createdAt: new Date().toISOString().split('T')[0],
      projectIds: [],
      members: [],
    };

    addTeam(newTeam);
    toast.success('Tạo nhóm thành công!');
    setShowCreateTeam(false);
    setTeamName('');
    setTeamDescription('');
    setTeamColor('#3b82f6');
  };

  const handleSendInvitation = () => {
    if (!selectedTeam || !inviteEmail.trim()) {
      toast.error('Vui lòng nhập email!');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Email không hợp lệ!');
      return;
    }

    sendTeamInvitation(selectedTeam.id, inviteEmail, currentUser.name);
    toast.success(`Đã gửi lời mời đến ${inviteEmail}!`);
    setShowAddMember(false);
    setInviteEmail('');
  };

  const handleJoinTeam = () => {
    if (!joinCode.trim() || !joinMemberName.trim() || !joinMemberRole.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const initials = joinMemberName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);

    const newMember: TeamMember = {
      id: Date.now(),
      name: joinMemberName,
      role: joinMemberRole,
      email: 'user@example.com', // In real app, get from auth
      phone: joinMemberPhone,
      avatar: initials,
      status: 'online',
      skills: joinMemberSkills.split(',').map(s => s.trim()).filter(Boolean),
    };

    const success = joinTeamByCode(joinCode, newMember);
    
    if (success) {
      toast.success('Tham gia nhóm thành công!');
      setShowJoinTeam(false);
      setJoinCode('');
      setJoinMemberName('');
      setJoinMemberRole('');
      setJoinMemberPhone('');
      setJoinMemberSkills('');
    } else {
      toast.error('Mã mời không hợp lệ!');
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã mời!');
  };

  const handleDeleteTeam = (teamId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
      deleteTeam(teamId);
      if (selectedTeam?.id === teamId) {
        setSelectedTeam(teams.length > 1 ? teams.find(t => t.id !== teamId) || null : null);
      }
      toast.success('Đã xóa nhóm!');
    }
  };

  const handleRemoveMember = (teamId: number, memberId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      removeMemberFromTeam(teamId, memberId);
      toast.success('Đã xóa thành viên!');
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedTeam) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'Bạn',
        avatar: 'BN',
        message: messageInput,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: 'Hôm nay',
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput('');
    }
  };

  const getTeamStats = (team: Team) => {
    const teamTasks = tasks.filter(task => 
      team.members.some(member => member.name === task.assignee)
    );
    const completedTasks = teamTasks.filter(task => task.status === 'Hoàn thành').length;
    const inProgressTasks = teamTasks.filter(task => task.status === 'Đang thực hiện').length;
    
    return {
      totalTasks: teamTasks.length,
      completedTasks,
      inProgressTasks,
    };
  };

  const getMemberStats = (member: TeamMember, teamId: number) => {
    const memberTasks = tasks.filter(task => task.assignee === member.name);
    const team = teams.find(t => t.id === teamId);
    const memberProjects = team ? projects.filter(p => team.projectIds.includes(p.id)) : [];
    
    return {
      totalTasks: memberTasks.length,
      completedTasks: memberTasks.filter(t => t.status === 'Hoàn thành').length,
      inProgressTasks: memberTasks.filter(t => t.status === 'Đang thực hiện').length,
      projects: memberProjects.map(p => p.name),
    };
  };

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-6">
        <div className="text-center">
          <UsersIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Chưa có nhóm nào</h3>
          <p className="text-gray-600 mb-6">Tạo nhóm đầu tiên để bắt đầu cộng tác</p>
        </div>
        <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tạo nhóm mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo nhóm mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Tên nhóm</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nhập tên nhóm..."
                />
              </div>
              <div>
                <Label htmlFor="team-description">Mô tả</Label>
                <Textarea
                  id="team-description"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Mô tả về nhóm..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Màu nhóm</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {teamColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setTeamColor(color.value)}
                      className={`h-10 rounded-lg transition-all border-2 ${
                        teamColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateTeam}>
                  Tạo nhóm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Quản lý nhóm</h2>
          <p className="text-gray-600 mt-1">
            {teams.length} nhóm • {teams.reduce((sum, t) => sum + t.members.length, 0)} thành viên
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tạo nhóm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo nhóm mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Tên nhóm</Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Nhập tên nhóm..."
                  />
                </div>
                <div>
                  <Label htmlFor="team-description">Mô tả</Label>
                  <Textarea
                    id="team-description"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Mô tả về nhóm..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Màu nhóm</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {teamColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTeamColor(color.value)}
                        className={`h-10 rounded-lg transition-all border-2 ${
                          teamColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateTeam}>
                    Tạo nhóm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showJoinTeam} onOpenChange={setShowJoinTeam}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Tham gia nhóm
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tham gia nhóm bằng mã mời</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="join-code">Mã mời</Label>
                  <Input
                    id="join-code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Nhập mã mời (VD: FE2025)"
                  />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="join-name">Họ và tên</Label>
                  <Input
                    id="join-name"
                    value={joinMemberName}
                    onChange={(e) => setJoinMemberName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <Label htmlFor="join-role">Vai trò</Label>
                  <Input
                    id="join-role"
                    value={joinMemberRole}
                    onChange={(e) => setJoinMemberRole(e.target.value)}
                    placeholder="Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="join-phone">Số điện thoại (tùy chọn)</Label>
                  <Input
                    id="join-phone"
                    value={joinMemberPhone}
                    onChange={(e) => setJoinMemberPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <Label htmlFor="join-skills">Kỹ năng (phân cách bằng dấu phẩy, tùy chọn)</Label>
                  <Input
                    id="join-skills"
                    value={joinMemberSkills}
                    onChange={(e) => setJoinMemberSkills(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowJoinTeam(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleJoinTeam}>
                    Tham gia nhóm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams.map((team) => {
          const stats = getTeamStats(team);
          const isSelected = selectedTeam?.id === team.id;
          
          return (
            <Card
              key={team.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedTeam(team)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: team.color }}
                    >
                      <UsersIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTeam(team.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3 text-gray-600" />
                    <span className="text-sm text-gray-600">Mã mời:</span>
                    <span className="text-sm font-mono">{team.inviteCode}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyInviteCode(team.inviteCode);
                    }}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Thành viên</span>
                  <span className="font-medium">{team.members.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dự án</span>
                  <span className="font-medium">{team.projectIds.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Công việc</span>
                  <span className="font-medium">
                    {stats.completedTasks}/{stats.totalTasks}
                  </span>
                </div>
                {stats.totalTasks > 0 && (
                  <Progress value={(stats.completedTasks / stats.totalTasks) * 100} />
                )}
                <div className="flex items-center -space-x-2 mt-3">
                  {team.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback
                        className="text-white text-xs"
                        style={{ backgroundColor: team.color }}
                      >
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      +{team.members.length - 4}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Team Details */}
      {selectedTeam && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedTeam.color }}
                >
                  <UsersIcon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>{selectedTeam.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedTeam.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Mời thành viên
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mời thành viên vào {selectedTeam.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-900">Mã mời nhóm</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyInviteCode(selectedTeam.inviteCode)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Sao chép
                          </Button>
                        </div>
                        <p className="text-2xl text-blue-900 tracking-wider">{selectedTeam.inviteCode}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label htmlFor="invite-email">Email thành viên</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="nguyenvana@company.com"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Người dùng sẽ nhận được thông báo và có thể chấp nhận hoặc từ chối lời mời
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setShowAddMember(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleSendInvitation}>
                          <Send className="w-4 h-4 mr-2" />
                          Gửi lời mời
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="members">Thành viên ({selectedTeam.members.length})</TabsTrigger>
                <TabsTrigger value="projects">Dự án ({selectedTeam.projectIds.length})</TabsTrigger>
                <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
              </TabsList>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4 mt-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm thành viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTeam.members
                    .filter(member => 
                      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      member.role.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((member) => {
                    const stats = getMemberStats(member, selectedTeam.id);
                    
                    return (
                      <Card key={member.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div 
                              className="flex items-start gap-4 flex-1 cursor-pointer"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowMemberProfile(true);
                              }}
                            >
                              <div className="relative">
                                <Avatar className="w-16 h-16">
                                  <AvatarFallback
                                    className="text-white text-lg"
                                    style={{ backgroundColor: selectedTeam.color }}
                                  >
                                    {member.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`
                                    absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
                                    ${member.status === 'online' ? 'bg-green-500' : 
                                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}
                                  `}
                                />
                              </div>
                              <div>
                                <h4 className="mb-1 hover:text-blue-600 transition-colors">{member.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-3 h-3" />
                                    <span>{member.email}</span>
                                  </div>
                                  {member.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Phone className="w-3 h-3" />
                                      <span>{member.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Task Progress */}
                          {stats.totalTasks > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Tiến độ công việc</span>
                                <span className="text-sm">
                                  {stats.completedTasks}/{stats.totalTasks} tasks
                                </span>
                              </div>
                              <Progress value={(stats.completedTasks / stats.totalTasks) * 100} />
                            </div>
                          )}

                          {/* Task Statistics */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-lg">{stats.totalTasks}</div>
                              <div className="text-xs text-gray-600">Tổng số</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-2">
                              <div className="text-lg text-green-600">{stats.completedTasks}</div>
                              <div className="text-xs text-gray-600">Hoàn thành</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-lg text-blue-600">{stats.inProgressTasks}</div>
                              <div className="text-xs text-gray-600">Đang làm</div>
                            </div>
                          </div>

                          {/* Projects */}
                          {stats.projects.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Dự án tham gia:</p>
                              <div className="flex flex-wrap gap-1">
                                {stats.projects.map((project, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {project}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills */}
                          {member.skills.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Kỹ năng:</p>
                              <div className="flex flex-wrap gap-1">
                                {member.skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    className="text-xs"
                                    style={{ 
                                      backgroundColor: `${selectedTeam.color}20`,
                                      color: selectedTeam.color,
                                    }}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 mt-6">
                {selectedTeam.projectIds.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Nhóm chưa tham gia dự án nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTeam.projectIds.map((projectId) => {
                      const project = projects.find(p => p.id === projectId);
                      if (!project) return null;

                      const projectTasks = tasks.filter(t => 
                        t.projectId === projectId &&
                        selectedTeam.members.some(m => m.name === t.assignee)
                      );

                      return (
                        <Card key={project.id}>
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: project.color }}
                              >
                                <Folder className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{project.name}</CardTitle>
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Trạng thái</span>
                              <Badge>{project.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Tiến độ</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Công việc của nhóm</span>
                              <span>{projectTasks.length}</span>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="space-y-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-gray-900">Bảng xếp hạng tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Xếp hạng theo số công việc hoàn thành trong tháng
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedTeam.members
                    .map(member => ({
                      ...member,
                      stats: getMemberStats(member, selectedTeam.id)
                    }))
                    .sort((a, b) => b.stats.completedTasks - a.stats.completedTasks)
                    .map((member, index) => (
                      <div
                        key={member.id}
                        className={`
                          flex items-center gap-4 p-4 rounded-lg transition-all
                          ${index < 3 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200' 
                            : 'bg-gray-50 hover:bg-gray-100'
                          }
                        `}
                      >
                        <div
                          className={`
                            flex items-center justify-center w-10 h-10 rounded-full shrink-0
                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                              index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white' :
                              'bg-gray-200 text-gray-700'
                            }
                          `}
                        >
                          <span className="font-semibold">{index + 1}</span>
                        </div>

                        <Avatar className="w-12 h-12">
                          <AvatarFallback
                            className="text-white"
                            style={{ backgroundColor: selectedTeam.color }}
                          >
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm">{member.name}</h4>
                            {index === 0 && <Trophy className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>

                        <div className="text-center px-4">
                          <div className="text-2xl text-blue-600">{member.stats.completedTasks}</div>
                          <div className="text-xs text-gray-600">Hoàn thành</div>
                        </div>

                        <div className="text-center px-4">
                          <div className="text-lg text-gray-700">{member.stats.inProgressTasks}</div>
                          <div className="text-xs text-gray-600">Đang làm</div>
                        </div>

                        <div className="text-center px-4 min-w-[100px]">
                          {member.stats.totalTasks > 0 && (
                            <>
                              <Progress value={(member.stats.completedTasks / member.stats.totalTasks) * 100} className="mb-1" />
                              <div className="text-xs text-gray-600">
                                {Math.round((member.stats.completedTasks / member.stats.totalTasks) * 100)}% hoàn thành
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Member Profile Dialog */}
      <MemberProfileDialog
        member={selectedMember}
        isOpen={showMemberProfile}
        onClose={() => setShowMemberProfile(false)}
      />
    </div>
  );
}