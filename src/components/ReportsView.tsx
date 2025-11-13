import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle2 } from 'lucide-react';

const performanceData = [
  { month: 'T6', completed: 42, planned: 50, efficiency: 84 },
  { month: 'T7', completed: 58, planned: 60, efficiency: 97 },
  { month: 'T8', completed: 51, planned: 55, efficiency: 93 },
  { month: 'T9', completed: 68, planned: 70, efficiency: 97 },
  { month: 'T10', completed: 45, planned: 65, efficiency: 69 },
];

const memberProductivity = [
  { name: 'Nguyễn Văn A', completed: 8, inProgress: 4, total: 12, efficiency: 67 },
  { name: 'Trần Thị B', completed: 9, inProgress: 6, total: 15, efficiency: 60 },
  { name: 'Lê Văn C', completed: 7, inProgress: 3, total: 10, efficiency: 70 },
  { name: 'Phạm Văn D', completed: 5, inProgress: 3, total: 8, efficiency: 63 },
  { name: 'Nguyễn Thị E', completed: 10, inProgress: 4, total: 14, efficiency: 71 },
  { name: 'Hoàng Văn F', completed: 7, inProgress: 2, total: 9, efficiency: 78 },
];

const projectComparison = [
  { project: 'Website Công ty', planned: 24, completed: 16, onTime: 14, delayed: 2 },
  { project: 'App Mobile', planned: 32, completed: 14, onTime: 12, delayed: 2 },
  { project: 'Hệ thống CRM', planned: 18, completed: 4, onTime: 4, delayed: 0 },
  { project: 'Dashboard Analytics', planned: 15, completed: 15, onTime: 15, delayed: 0 },
];

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Báo cáo & Phân tích</h2>
          <p className="text-gray-600 mt-1">Thống kê hiệu suất và tiến độ công việc</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 tháng</SelectItem>
              <SelectItem value="3months">3 tháng</SelectItem>
              <SelectItem value="6months">6 tháng</SelectItem>
              <SelectItem value="1year">1 năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Hiệu suất trung bình</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">88%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+5%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Công việc đúng hạn</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">92%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+3%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Thời gian trung bình</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3.2 ngày</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">-0.5 ngày</span> so với trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tỷ lệ quá hạn</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">8%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-600">+2%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Hoàn thành" strokeWidth={2} />
                <Line type="monotone" dataKey="planned" stroke="#3b82f6" name="Kế hoạch" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Năng suất theo thành viên</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Hoàn thành" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="Đang làm" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>So sánh tiến độ dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Đã hoàn thành" />
              <Bar dataKey="onTime" fill="#3b82f6" name="Đúng hạn" />
              <Bar dataKey="delayed" fill="#ef4444" name="Trễ hạn" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Member Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng chi tiết hiệu suất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Thành viên</th>
                  <th className="text-center py-3 px-4">Tổng công việc</th>
                  <th className="text-center py-3 px-4">Hoàn thành</th>
                  <th className="text-center py-3 px-4">Đang làm</th>
                  <th className="text-center py-3 px-4">Hiệu suất</th>
                </tr>
              </thead>
              <tbody>
                {memberProductivity.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="text-center py-3 px-4">{member.total}</td>
                    <td className="text-center py-3 px-4 text-green-600">{member.completed}</td>
                    <td className="text-center py-3 px-4 text-blue-600">{member.inProgress}</td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${member.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{member.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
