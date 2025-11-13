import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { Calendar, User, FolderOpen, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  progress: number;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  color: string;
}

interface TaskDetailDialogProps {
  task: Task | null;
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDialog({ task, project, isOpen, onClose }: TaskDetailDialogProps) {
  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-700';
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-700';
      case 'Chưa bắt đầu':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-100 text-red-700';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-700';
      case 'Thấp':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Đang thực hiện':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Chưa bắt đầu':
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết công việc</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                Ưu tiên: {task.priority}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          {task.status !== 'Chưa bắt đầu' && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(task.status)}
                  <h4 className="text-sm">Tiến độ công việc</h4>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Hoàn thành</span>
                  <span className="text-sm">{task.progress}%</span>
                </div>
                <Progress value={task.progress} />
              </CardContent>
            </Card>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project */}
            {project && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <FolderOpen className="w-5 h-5" style={{ color: project.color }} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Dự án</p>
                      <p className="text-gray-900 text-sm">{project.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assignee */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Người thực hiện</p>
                    <p className="text-gray-900 text-sm">{task.assignee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Date */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Hạn hoàn thành</p>
                    <p className="text-gray-900 text-sm">{task.dueDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Mức độ ưu tiên</p>
                    <p className="text-gray-900 text-sm">{task.priority}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
