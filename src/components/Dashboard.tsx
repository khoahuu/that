import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Calendar, Users } from 'lucide-react';
import { useData } from './DataContext';

export function Dashboard() {
  const { projects, tasks } = useData();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Hoàn thành').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Đang thực hiện').length;
  const notStartedTasks = tasks.filter(t => t.status === 'Chưa bắt đầu').length;
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today && t.status !== 'Hoàn thành';
  }).length;

  const statsData = [
    { name: 'Hoàn thành', value: completedTasks, color: '#10b981' },
    { name: 'Đang làm', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Chưa bắt đầu', value: notStartedTasks, color: '#f59e0b' },
    { name: 'Quá hạn', value: overdueTasks, color: '#ef4444' },
  ];

  // Project progress (mock weekly data for now)
  const projectProgress = [
    { name: 'Tuần 1', completed: Math.floor(completedTasks * 0.3), inProgress: Math.floor(inProgressTasks * 0.3) },
    { name: 'Tuần 2', completed: Math.floor(completedTasks * 0.5), inProgress: Math.floor(inProgressTasks * 0.5) },
    { name: 'Tuần 3', completed: Math.floor(completedTasks * 0.7), inProgress: Math.floor(inProgressTasks * 0.7) },
    { name: 'Tuần 4', completed: completedTasks, inProgress: inProgressTasks },
  ];

  // Get recent tasks
  const recentTasks = tasks.slice(0, 5);

  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Không xác định';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng công việc</CardTitle>
            <FolderKanban className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              Từ {projects.length} dự án
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Hoàn thành</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{completedTasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}% tổng công việc
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Đang thực hiện</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{inProgressTasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalTasks > 0 ? ((inProgressTasks / totalTasks) * 100).toFixed(1) : 0}% tổng công việc
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Quá hạn</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{overdueTasks}</div>
            <p className="text-xs text-gray-500 mt-1">
              {overdueTasks > 0 ? 'Cần xử lý ngay' : 'Tốt lắm!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ công việc theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Hoàn thành" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="Đang làm" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bố trạng thái công việc</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Công việc gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Chưa có công việc nào
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{task.title}</h4>
                      <p className="text-sm text-gray-500">{getProjectName(task.projectId)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.priority === 'Cao'
                            ? 'destructive'
                            : task.priority === 'Trung bình'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={
                          task.status === 'Hoàn thành'
                            ? 'default'
                            : task.status === 'Đang thực hiện'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          task.status === 'Hoàn thành'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : task.status === 'Đang thực hiện'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : ''
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{task.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600">{task.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
