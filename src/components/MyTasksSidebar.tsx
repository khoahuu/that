import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { useData } from './DataContext';
import { TaskDetailDialog } from './TaskDetailDialog';
import type { UserData } from './AuthPage';

interface MyTasksSidebarProps {
  currentUser: UserData;
}

export function MyTasksSidebar({ currentUser }: MyTasksSidebarProps) {
  const { tasks, projects } = useData();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  // Get tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignee === currentUser.name);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-500';
      case 'Đang thực hiện':
        return 'bg-yellow-500';
      case 'Chưa bắt đầu':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Hoàn thành':
        return 'done';
      case 'Đang thực hiện':
        return 'in progress';
      case 'Chưa bắt đầu':
        return 'not started';
      default:
        return status;
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  const selectedProject = selectedTask 
    ? projects.find(p => p.id === selectedTask.projectId) 
    : null;

  return (
    <>
      <div className="px-3 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-gray-600" />
            <span className="text-sm">My Tasks</span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {myTasks.length}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1">
            {myTasks.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">
                Không có công việc nào
              </div>
            ) : (
              myTasks.slice(0, 5).map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="flex items-start gap-2 w-full px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getStatusColor(task.status)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getStatusText(task.status)}
                    </p>
                  </div>
                </button>
              ))
            )}
            {myTasks.length > 5 && (
              <div className="px-3 py-1 text-xs text-gray-500">
                +{myTasks.length - 5} công việc khác
              </div>
            )}
          </div>
        )}
      </div>

      <TaskDetailDialog
        task={selectedTask}
        project={selectedProject}
        isOpen={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
      />
    </>
  );
}
