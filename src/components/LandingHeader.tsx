import { Button } from './ui/button';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LandingHeaderProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingHeader({ onGetStarted, onLogin }: LandingHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600 text-xl">TaskFlow</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Quản lý dự án chuyên nghiệp</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tính năng
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bảng giá
            </a>
            <a href="#customers" className="text-gray-700 hover:text-blue-600 transition-colors">
              Khách hàng
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Về chúng tôi
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Liên hệ
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" onClick={onLogin}>
              Đăng nhập
            </Button>
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Dùng thử miễn phí
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-3">
              <a
                href="#features"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Tính năng
              </a>
              <a
                href="#pricing"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Bảng giá
              </a>
              <a
                href="#customers"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Khách hàng
              </a>
              <a
                href="#about"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Về chúng tôi
              </a>
              <a
                href="#contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Liên hệ
              </a>
              <div className="border-t border-gray-200 pt-3 space-y-2 px-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onLogin();
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onGetStarted();
                  }}
                >
                  Dùng thử miễn phí
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
