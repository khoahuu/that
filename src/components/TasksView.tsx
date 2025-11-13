import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Calendar, Pencil, Trash2, Filter, User, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from './DataContext';
import { UserData } from './AuthPage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface TasksViewProps {
  currentUser: UserData;
}

export function TasksView({ currentUser }: TasksViewProps) {
  const { tasks, projects, addTask, updateTask, deleteTask } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'Chưa bắt đầu',
    priority: 'Trung bình',
    assignee: currentUser.name,
    dueDate: '',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) {
      toast.error('Vui lòng chọn dự án!');
      return;
    }

    addTask({
      title: formData.title,
      description: formData.description,
      projectId: parseInt(formData.projectId),
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee,
      dueDate: formData.dueDate,
      progress: formData.status === 'Hoàn thành' ? 100 : 0,
      comments: 0,
      attachments: 0,
    });

    toast.success('Công việc mới đã được tạo thành công!');
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !formData.projectId) {
      toast.error('Vui lòng chọn dự án!');
      return;
    }

    updateTask(selectedTask.id, {
      title: formData.title,
      description: formData.description,
      projectId: parseInt(formData.projectId),
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee,
      dueDate: formData.dueDate,
    });

    toast.success('Công việc đã được cập nhật!');
    setIsEditDialogOpen(false);
    setSelectedTask(null);
    resetForm();
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      toast.success('Công việc đã được xóa!');
      setIsDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const openEditDialog = (task: any) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      projectId: task.projectId.toString(),
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (task: any) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectId: '',
      status: 'Chưa bắt đầu',
      priority: 'Trung bình',
      assignee: currentUser.name,
      dueDate: '',
    });
  };

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Không xác định';
  };

  const getProjectColor = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.color : '#6b7280';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Đang thực hiện':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Chưa bắt đầu':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Thấp':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return '';
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterProject !== 'all' && task.projectId.toString() !== filterProject) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Công Việc</h2>
          <p className="text-gray-600 mt-1">Quản lý tất cả các công việc của bạn</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800">
              <Plus className="w-4 h-4" />
              Tạo Công Việc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo công việc mới</DialogTitle>
              <p className="text-sm text-gray-500">Điền thông tin để tạo công việc mới</p>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề công việc"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả công việc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="projectId">Dự án *</Label>
                <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
                      <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
                      <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Độ ưu tiên</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cao">Cao</SelectItem>
                      <SelectItem value="Trung bình">Trung bình</SelectItem>
                      <SelectItem value="Thấp">Thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Người thực hiện</Label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{currentUser.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">Tôi</Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dueDate">Hạn chót</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
                  Hủy
                </Button>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800">Tạo công việc</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Lọc</span>
        </div>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ưu tiên</SelectItem>
            <SelectItem value="Cao">Cao</SelectItem>
            <SelectItem value="Trung bình">Trung bình</SelectItem>
            <SelectItem value="Thấp">Thấp</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
            <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tất cả dự án" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả dự án</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="col-span-3 text-sm text-gray-600">Tiêu đề</div>
          <div className="col-span-2 text-sm text-gray-600">Dự án</div>
          <div className="col-span-2 text-sm text-gray-600">Người thực hiện</div>
          <div className="col-span-1 text-sm text-gray-600">Trạng thái</div>
          <div className="col-span-1 text-sm text-gray-600">Ưu tiên</div>
          <div className="col-span-2 text-sm text-gray-600">Hạn chót</div>
          <div className="col-span-1 text-sm text-gray-600 text-right">Thao tác</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredTasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Không có công việc nào
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-3">
                  <div className="text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getProjectColor(task.projectId) }}
                    />
                    <span className="text-sm text-gray-700">{getProjectName(task.projectId)}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{task.assignee}</span>
                    {task.assignee === currentUser.name && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">Tôi</Badge>
                    )}
                  </div>
                </div>

                <div className="col-span-1">
                  <Badge variant="secondary" className={getStatusBadgeClass(task.status)}>
                    {task.status}
                  </Badge>
                </div>

                <div className="col-span-1">
                  <Badge variant="secondary" className={getPriorityBadgeClass(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>

                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {task.dueDate}
                  </div>
                </div>

                <div className="col-span-1 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(task)}
                    className="h-8 w-8 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(task)}
                    className="h-8 w-8 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công việc</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                placeholder="Nhập tiêu đề công việc"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                placeholder="Nhập mô tả công việc"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-projectId">Dự án *</Label>
              <Select value={formData.projectId} onValueChange={(value) => setFormData({ ...formData, projectId: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-assignee">Người thực hiện</Label>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{formData.assignee}</span>
                {formData.assignee === currentUser.name && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700">Tôi</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
                    <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-priority">Độ ưu tiên</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-dueDate">Hạn chót</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
                Hủy
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">Cập nhật</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa công việc "{selectedTask?.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}