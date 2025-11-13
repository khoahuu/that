import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Mail, Phone, Briefcase, Award } from 'lucide-react';
import type { TeamMember } from './DataContext';

interface MemberProfileDialogProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberProfileDialog({ member, isOpen, onClose }: MemberProfileDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hồ sơ thành viên</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 text-2xl">
              <AvatarFallback
                className="text-white"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="text-gray-900 mb-1">{member.name}</h3>
              <p className="text-gray-600 mb-3">{member.role}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="secondary"
                  className={
                    member.status === 'online' 
                      ? 'bg-green-100 text-green-700' 
                      : member.status === 'away'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {member.status === 'online' ? 'Trực tuyến' : member.status === 'away' ? 'Vắng mặt' : 'Ngoại tuyến'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm mb-3">Thông tin liên hệ</h4>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-gray-900">{member.email}</p>
                </div>
              </div>

              {member.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Điện thoại</p>
                    <p className="text-gray-900">{member.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          {member.skills && member.skills.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm">Kỹ năng</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-purple-50 text-purple-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-orange-600" />
                <h4 className="text-sm">Thông tin bổ sung</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vai trò:</span>
                  <span className="text-gray-900">{member.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge 
                    variant="secondary"
                    className={
                      member.status === 'online' 
                        ? 'bg-green-100 text-green-700' 
                        : member.status === 'away'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {member.status === 'online' ? 'Trực tuyến' : member.status === 'away' ? 'Vắng mặt' : 'Ngoại tuyến'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
