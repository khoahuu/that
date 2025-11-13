import { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  progress: number;
  comments: number;
  attachments: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  skills: string[];
}

export interface Team {
  id: number;
  name: string;
  description: string;
  color: string;
  members: TeamMember[];
  createdAt: string;
  projectIds: number[];
  inviteCode: string;
}

export interface TeamInvitation {
  id: number;
  teamId: number;
  teamName: string;
  teamColor: string;
  invitedEmail: string;
  invitedBy: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  color: string;
  type: 'event' | 'busy' | 'meeting' | 'deadline' | 'other';
}

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  teams: Team[];
  invitations: TeamInvitation[];
  events: CalendarEvent[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: number, team: Partial<Team>) => void;
  deleteTeam: (id: number) => void;
  addMemberToTeam: (teamId: number, member: TeamMember) => void;
  removeMemberFromTeam: (teamId: number, memberId: number) => void;
  sendTeamInvitation: (teamId: number, email: string, invitedBy: string) => void;
  acceptInvitation: (invitationId: number, memberData: TeamMember) => void;
  rejectInvitation: (invitationId: number) => void;
  joinTeamByCode: (inviteCode: string, member: TeamMember) => boolean;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: number, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: 1,
    name: 'Website Thương Mại Điện Tử',
    description: 'Phát triển website thương mại điện tử với đầy đủ tính năng',
    status: 'Chưa bắt đầu',
    progress: 0,
    startDate: '2025-10-20',
    endDate: '2025-04-15',
    team: ['Nguyễn Văn A', 'Trần Thị B'],
    color: '#3b82f6',
  },
  {
    id: 2,
    name: 'Ứng Dụng Mobile',
    description: 'Ứng dụng mobile đa nền tảng với React Native',
    status: 'Đang thực hiện',
    progress: 45,
    startDate: '2025-09-15',
    endDate: '2025-03-10',
    team: ['Lê Văn C', 'Phạm Văn D'],
    color: '#10b981',
  },
  {
    id: 3,
    name: 'Hệ Thống CRM',
    description: 'Hệ thống quản lý quan hệ khách hàng tích hợp AI',
    status: 'Hoàn thành',
    progress: 100,
    startDate: '2025-08-01',
    endDate: '2024-12-30',
    team: ['Nguyễn Thị E', 'Trần Văn F'],
    color: '#8b5cf6',
  },
];

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Tích hợp công thanh toán',
    description: 'Kết nối với cổng thanh toán VNPay',
    projectId: 1,
    status: 'Chưa bắt đầu',
    priority: 'Cao',
    assignee: 'Nguyễn Văn A',
    dueDate: '2025-04-15',
    progress: 0,
    comments: 3,
    attachments: 2,
  },
  {
    id: 2,
    title: 'Thiết kế UI/UX',
    description: 'Thiết kế giao diện cho màn hình chính',
    projectId: 2,
    status: 'Đang thực hiện',
    priority: 'Trung bình',
    assignee: 'Trần Thị B',
    dueDate: '2025-03-10',
    progress: 60,
    comments: 5,
    attachments: 1,
  },
  {
    id: 3,
    title: 'Phát triển tính năng đăng nhập',
    description: 'Xây dựng authentication với OAuth và Firebase',
    projectId: 2,
    status: 'Đang thực hiện',
    priority: 'Cao',
    assignee: 'Lê Văn C',
    dueDate: '2025-03-31',
    progress: 75,
    comments: 2,
    attachments: 3,
  },
  {
    id: 4,
    title: 'Kiểm thử và triển khai',
    description: 'Thực hiện kiểm thử toàn diện và deploy lên production',
    projectId: 3,
    status: 'Hoàn thành',
    priority: 'Thấp',
    assignee: 'Phạm Văn D',
    dueDate: '2024-12-30',
    progress: 100,
    comments: 8,
    attachments: 0,
  },
];

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const initialTeams: Team[] = [
  {
    id: 1,
    name: 'Team Frontend',
    description: 'Nhóm phát triển giao diện người dùng',
    color: '#3b82f6',
    createdAt: '2025-01-15',
    projectIds: [1, 2],
    inviteCode: 'FE2025',
    members: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        role: 'Frontend Developer',
        email: 'nguyenvana@company.com',
        phone: '0901234567',
        avatar: 'NVA',
        status: 'online',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
      },
      {
        id: 2,
        name: 'Trần Thị B',
        role: 'Full-stack Developer',
        email: 'tranthib@company.com',
        phone: '0902345678',
        avatar: 'TTB',
        status: 'online',
        skills: ['Node.js', 'React', 'PostgreSQL'],
      },
      {
        id: 6,
        name: 'Hoàng Văn F',
        role: 'UI/UX Designer',
        email: 'hoangvanf@company.com',
        phone: '0906789012',
        avatar: 'HVF',
        status: 'online',
        skills: ['Figma', 'Adobe XD', 'User Research'],
      },
    ],
  },
  {
    id: 2,
    name: 'Team Backend',
    description: 'Nhóm phát triển hệ thống backend',
    color: '#10b981',
    createdAt: '2025-01-10',
    projectIds: [2, 3],
    inviteCode: 'BE2025',
    members: [
      {
        id: 3,
        name: 'Lê Văn C',
        role: 'Backend Developer',
        email: 'levanc@company.com',
        phone: '0903456789',
        avatar: 'LVC',
        status: 'away',
        skills: ['Python', 'Django', 'Docker'],
      },
      {
        id: 4,
        name: 'Phạm Văn D',
        role: 'DevOps Engineer',
        email: 'phamvand@company.com',
        phone: '0904567890',
        avatar: 'PVD',
        status: 'online',
        skills: ['AWS', 'Kubernetes', 'CI/CD'],
      },
    ],
  },
  {
    id: 3,
    name: 'Team QA',
    description: 'Nhóm kiểm thử chất lượng',
    color: '#8b5cf6',
    createdAt: '2025-01-20',
    projectIds: [1, 2, 3],
    inviteCode: 'QA2025',
    members: [
      {
        id: 5,
        name: 'Nguyễn Thị E',
        role: 'QA Engineer',
        email: 'nguyenthie@company.com',
        phone: '0905678901',
        avatar: 'NTE',
        status: 'offline',
        skills: ['Selenium', 'Jest', 'Test Planning'],
      },
    ],
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Math.max(...projects.map(p => p.id), 0) + 1,
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: number, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    // Also delete all tasks associated with this project
    setTasks(tasks.filter(t => t.projectId !== id));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTeam = (team: Omit<Team, 'id' | 'inviteCode'>) => {
    const newTeam = {
      ...team,
      id: Math.max(...teams.map(t => t.id), 0) + 1,
      inviteCode: generateInviteCode(),
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: number, updatedTeam: Partial<Team>) => {
    setTeams(teams.map(t => t.id === id ? { ...t, ...updatedTeam } : t));
  };

  const deleteTeam = (id: number) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const addMemberToTeam = (teamId: number, member: TeamMember) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, member] }
        : team
    ));
  };

  const removeMemberFromTeam = (teamId: number, memberId: number) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: team.members.filter(m => m.id !== memberId) }
        : team
    ));
  };

  const sendTeamInvitation = (teamId: number, email: string, invitedBy: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const newInvitation: TeamInvitation = {
      id: Math.max(...invitations.map(i => i.id), 0) + 1,
      teamId,
      teamName: team.name,
      teamColor: team.color,
      invitedEmail: email,
      invitedBy,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setInvitations([...invitations, newInvitation]);
  };

  const acceptInvitation = (invitationId: number, memberData: TeamMember) => {
    const invitation = invitations.find(i => i.id === invitationId);
    if (!invitation) return;

    // Add member to team
    addMemberToTeam(invitation.teamId, memberData);

    // Update invitation status
    setInvitations(invitations.map(i => 
      i.id === invitationId ? { ...i, status: 'accepted' } : i
    ));
  };

  const rejectInvitation = (invitationId: number) => {
    setInvitations(invitations.map(i => 
      i.id === invitationId ? { ...i, status: 'rejected' } : i
    ));
  };

  const joinTeamByCode = (inviteCode: string, member: TeamMember): boolean => {
    const team = teams.find(t => t.inviteCode === inviteCode.toUpperCase());
    if (!team) return false;

    addMemberToTeam(team.id, member);
    return true;
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.max(...events.map(e => e.id), 0) + 1,
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (id: number, updatedEvent: Partial<CalendarEvent>) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        teams,
        invitations,
        events,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addTeam,
        updateTeam,
        deleteTeam,
        addMemberToTeam,
        removeMemberFromTeam,
        sendTeamInvitation,
        acceptInvitation,
        rejectInvitation,
        joinTeamByCode,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}