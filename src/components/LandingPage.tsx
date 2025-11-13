import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, LayoutDashboard, Users, BarChart3, GanttChart, Shield, Zap } from 'lucide-react';
import { LandingHeader } from './LandingHeader';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-indigo-600" />,
      title: 'Dashboard Tổng Quan',
      description: 'Theo dõi tất cả công việc và dự án ở một nơi với giao diện trực quan.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <GanttChart className="w-6 h-6 text-purple-600" />,
      title: 'Bảng Kanban & Gantt',
      description: 'Quản lý workflow với Kanban board và lịch trình với Gantt chart.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Users className="w-6 h-6 text-pink-600" />,
      title: 'Quản Lý Nhóm',
      description: 'Theo dõi hiệu suất và phân công công việc cho từng thành viên.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-cyan-600" />,
      title: 'Báo Cáo Chi Tiết',
      description: 'Phân tích dữ liệu với biểu đồ và báo cáo thông minh.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-600" />,
      title: 'Bảo Mật Cao',
      description: 'Phân quyền chi tiết và bảo vệ dữ liệu doanh nghiệp.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      title: 'Cộng Tác Thời Gian Thực',
      description: 'Làm việc cùng nhau với cập nhật tức thời.',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const benefits = [
    'Tăng 40% năng suất làm việc',
    'Giảm 60% thời gian họp hành',
    'Hoàn thành đúng 95% deadline',
    'Tối ưu hóa phân bổ nguồn lực',
    'Minh bạch tiến độ công việc',
    'Dễ dàng mở rộng quy mô',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <LandingHeader onGetStarted={onGetStarted} onLogin={onLogin} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm">
            ✨ Giải pháp quản lý dự án số 1 Việt Nam
          </div>
          <h2 className="text-gray-900 mb-6">
            Quản Lý Dự Án & Công Việc
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Hiệu Quả & Chuyên Nghiệp</span>
          </h2>
          <p className="text-gray-600 text-xl mb-8 leading-relaxed">
            Tối ưu hóa quy trình làm việc, tăng năng suất và hoàn thành mọi dự án đúng hạn
            với giải pháp quản lý toàn diện được thiết kế cho doanh nghiệp Việt Nam.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              Bắt đầu miễn phí
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Xem demo
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            ✓ Không cần thẻ tín dụng  ✓ Dùng thử 14 ngày  ✓ Hỗ trợ 24/7
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">5000+</div>
              <p className="text-gray-600">Doanh nghiệp tin dùng</p>
            </CardContent>
          </Card>
          <Card className="text-center border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">50K+</div>
              <p className="text-gray-600">Người dùng hàng ngày</p>
            </CardContent>
          </Card>
          <Card className="text-center border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-4xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">95%</div>
              <p className="text-gray-600">Dự án đúng hạn</p>
            </CardContent>
          </Card>
          <Card className="text-center border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">4.9/5</div>
              <p className="text-gray-600">Đánh giá từ khách hàng</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">Tính Năng Nổi Bật</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Đầy đủ công cụ cần thiết để quản lý dự án và công việc một cách chuyên nghiệp
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-xl transition-all border-2 hover:border-indigo-200 hover:scale-105 duration-300">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-white mb-6">
                Lợi Ích Khi Sử Dụng TaskFlow
              </h2>
              <p className="text-indigo-100 text-xl mb-8">
                Hàng ngàn doanh nghiệp đã cải thiện năng suất và hoàn thành dự án đúng hạn với TaskFlow
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                    <span className="text-white text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 shadow-2xl border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-center mb-4">Bắt đầu ngay hôm nay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Miễn phí</div>
                  <p className="text-gray-600 mb-6">14 ngày dùng thử</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700" size="lg" onClick={onGetStarted}>
                  Đăng ký miễn phí
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Đã có tài khoản?{' '}
                  <button onClick={onLogin} className="text-indigo-600 hover:underline">
                    Đăng nhập ngay
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
