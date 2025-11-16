import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  FolderKanban,
  User,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Pencil
} from 'lucide-react';
import { useData } from './DataContext';
import { toast } from 'sonner';

const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dayNamesVN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const eventColors = [
  { value: '#3b82f6', label: 'Xanh dương' },
  { value: '#10b981', label: 'Xanh lá' },
  { value: '#8b5cf6', label: 'Tím' },
  { value: '#f59e0b', label: 'Vàng' },
  { value: '#ef4444', label: 'Đỏ' },
  { value: '#06b6d4', label: 'Xanh cyan' },
  { value: '#ec4899', label: 'Hồng' },
];

export function GanttView() {
  const { projects, tasks, events, addEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6',
    type: 'event' as 'event' | 'busy' | 'meeting' | 'deadline' | 'other',
  });

  // Get days in month with week rows
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    // Group into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  // Check if date is within range
  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= startDate && dateStr <= endDate;
  };

  // Get events that span across a week
  const getEventsForWeek = (week: any[]) => {
    const weekEvents: any[] = [];

    // Add custom events
    events.forEach(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      
      // Check if event overlaps with this week
      const weekStart = week[0].date;
      const weekEnd = week[6].date;
      
      if (eventStartDate <= weekEnd && eventEndDate >= weekStart) {
        // Calculate start and end positions within the week
        let startCol = 0;
        let span = 7;
        
        for (let i = 0; i < week.length; i++) {
          const dayDate = week[i].date.toISOString().split('T')[0];
          if (dayDate === event.startDate) {
            startCol = i;
          }
          if (dayDate === event.endDate) {
            span = i - startCol + 1;
            break;
          }
        }
        
        // Adjust for events that start before or end after this week
        if (eventStartDate < weekStart) {
          startCol = 0;
        }
        if (eventEndDate > weekEnd) {
          span = 7 - startCol;
        }
        
        weekEvents.push({
          ...event,
          startCol,
          span,
          id: `event-${event.id}`,
        });
      }
    });

    // Add project spans
    projects.forEach(project => {
      if (project.status === 'Đang thực hiện') {
        const projectStartDate = new Date(project.startDate);
        const projectEndDate = new Date(project.endDate);
        
        const weekStart = week[0].date;
        const weekEnd = week[6].date;
        
        if (projectStartDate <= weekEnd && projectEndDate >= weekStart) {
          let startCol = 0;
          let span = 7;
          
          for (let i = 0; i < week.length; i++) {
            const dayDate = week[i].date.toISOString().split('T')[0];
            if (dayDate === project.startDate) {
              startCol = i;
            }
            if (dayDate === project.endDate) {
              span = i - startCol + 1;
              break;
            }
          }
          
          if (projectStartDate < weekStart) {
            startCol = 0;
          }
          if (projectEndDate > weekEnd) {
            span = 7 - startCol;
          }
          
          weekEvents.push({
            id: `project-${project.id}`,
            title: project.name,
            color: project.color,
            startCol,
            span,
            type: 'project',
            data: project,
          });
        }
      }
    });

    return weekEvents;
  };

  // Get upcoming events (projects and tasks with deadlines)
  const getUpcomingEvents = () => {
    const upcoming: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add ongoing projects
    projects.forEach(project => {
      if (project.status === 'Đang thực hiện') {
        const endDate = new Date(project.endDate);
        upcoming.push({
          id: `project-${project.id}`,
          title: project.name,
          date: endDate,
          type: 'Dự án đang làm',
          color: project.color,
          info: `${project.progress}% hoàn thành`,
          status: project.status,
          isProject: true
        });
      }
    });

    // Add remaining tasks
    tasks.forEach(task => {
      if (task.status !== 'Hoàn thành') {
        const dueDate = new Date(task.dueDate);
        if (dueDate >= today) {
          const project = projects.find(p => p.id === task.projectId);
          upcoming.push({
            id: `task-${task.id}`,
            title: task.title,
            date: dueDate,
            type: 'Công việc còn lại',
            color: project?.color || '#8b5cf6',
            projectName: project?.name,
            assignee: task.assignee,
            priority: task.priority,
            isProject: false
          });
        }
      }
    });

    // Add upcoming events
    events.forEach(event => {
      const eventDate = new Date(event.startDate);
      if (eventDate >= today) {
        upcoming.push({
          id: `event-${event.id}`,
          title: event.title,
          date: eventDate,
          type: 'Sự kiện sắp tới',
          color: event.color,
          info: event.startTime ? `${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}` : '',
          isProject: false
        });
      }
    });

    // Sort by date
    return upcoming.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 10);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (newEvent.startDate > newEvent.endDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu!');
      return;
    }

    addEvent(newEvent);
    toast.success('Đã thêm sự kiện thành công!');
    setIsAddEventOpen(false);
    setNewEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      color: '#3b82f6',
      type: 'event',
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    toast.success('Đã xóa sự kiện!');
  };

  const weeks = getDaysInMonth(currentDate);
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hôm nay
            </Button>
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <h2 className="text-gray-900 ml-2">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            {projects.length} dự án • {tasks.length} công việc • {events.length} sự kiện
          </p>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm sự kiện
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm sự kiện mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Nhập mô tả chi tiết"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Ngày kết thúc *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Giờ bắt đầu</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Giờ kết thúc</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">Loại sự kiện</Label>
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Sự kiện</SelectItem>
                      <SelectItem value="busy">Bận</SelectItem>
                      <SelectItem value="meeting">Họp</SelectItem>
                      <SelectItem value="deadline">Hạn chót</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Màu sắc</Label>
                  <div className="flex gap-2 mt-2">
                    {eventColors.map((color) => (
                      <button
                        key={color.value}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newEvent.color === color.value ? 'border-gray-900 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setNewEvent({ ...newEvent, color: color.value })}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddEvent} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Thêm sự kiện
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {dayNames.map((day, index) => (
              <div
                key={day}
                className="p-3 text-center text-sm text-gray-600 border-r last:border-r-0"
              >
                <div>{day}</div>
                <div className="text-xs text-gray-500">{dayNamesVN[index]}</div>
              </div>
            ))}
          </div>

          {/* Calendar weeks */}
          <div className="flex-1 overflow-auto">
            {weeks.map((week, weekIndex) => {
              const weekEvents = getEventsForWeek(week);
              
              return (
                <div key={weekIndex} className="relative border-b">
                  {/* Week row with date cells */}
                  <div className="grid grid-cols-7">
                    {week.map((day, dayIndex) => {
                      const isCurrentDay = isToday(day.date);
                      const dateStr = day.date.toISOString().split('T')[0];
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`
                            min-h-[100px] p-2 border-r last:border-r-0
                            ${!day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                          `}
                        >
                          <div className={`
                            text-sm flex items-center justify-center w-7 h-7 rounded-full
                            ${isCurrentDay ? 'bg-blue-600 text-white' : ''}
                            ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                          `}>
                            {day.date.getDate()}
                          </div>
                          {dateStr === '2024-10-28' && (
                            <div className="text-xs text-gray-600 mt-1">11:55pm busy</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Event bars overlay */}
                  <div className="absolute top-10 left-0 right-0 px-2 space-y-1">
                    {weekEvents.map((event, eventIndex) => (
                      <div
                        key={event.id}
                        className="grid grid-cols-7 gap-0"
                        style={{ 
                          gridColumn: `${event.startCol + 1} / span ${event.span}`,
                        }}
                      >
                        <div
                          className="col-span-full text-white text-xs px-2 py-1 rounded flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity group"
                          style={{ 
                            backgroundColor: event.color,
                            gridColumn: `1 / span ${event.span}`,
                          }}
                          title={event.title}
                        >
                          <span className="truncate">{event.title}</span>
                          {event.type !== 'project' && (
                            <button
                                onClick={() => handleDeleteEvent(event.id.replace("event-", ""))}
                                className="opacity-0 group-hover:opacity-100 ml-2"
                                aria-label="Delete event"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events list */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-3">Lịch trình sắp tới</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Không có lịch trình nào</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100">
                  <div 
                    className="w-1 h-full rounded"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm truncate">{event.title}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {event.date.getDate()}/{event.date.getMonth() + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {event.type}
                      </Badge>
                      {event.projectName && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FolderKanban className="w-3 h-3" />
                          <span className="truncate">{event.projectName}</span>
                        </div>
                      )}
                      {event.assignee && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          {event.assignee}
                        </div>
                      )}
                      {event.info && (
                        <span className="text-xs text-gray-600">{event.info}</span>
                      )}
                      {event.priority && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            event.priority === 'Cao' ? 'bg-red-100 text-red-700' :
                            event.priority === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.priority}
                        </Badge>
                      )}
                      {event.status && (
                        <Badge variant="secondary" className="text-xs">
                          {event.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
