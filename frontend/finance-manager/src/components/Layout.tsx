import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChartPie,
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
  HiOutlineBanknotes,
} from 'react-icons/hi2';

const navItems = [
  { to: '/dashboard', icon: HiOutlineChartPie, label: 'Dashboard' },
  { to: '/transactions', icon: HiOutlineCurrencyRupee, label: 'Transactions' },
  { to: '/monthly-report', icon: HiOutlineCalendar, label: 'Monthly Report' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 glass flex flex-col z-50 transition-all duration-300 overflow-x-hidden">
        {/* Logo */}
        <div className="px-5 lg:px-6 pt-8 pb-6 border-b border-dark-700/50 flex justify-center lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
              <HiOutlineBanknotes className="w-6 h-6 text-white" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-lg font-bold text-white tracking-tight">FinTrack</h1>
              <p className="text-xs text-dark-400">Finance Manager</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 lg:px-4 py-6 space-y-1.5 flex flex-col items-center lg:items-stretch">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group w-full justify-center lg:justify-start
                ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-300 shadow-lg shadow-primary-600/10'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/50'
                }`
              }
              title={item.label}
            >
              <item.icon className="w-6 h-6 lg:w-5 lg:h-5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 lg:px-4 pb-6 border-t border-dark-700/50 pt-4 flex flex-col items-center lg:items-stretch">
          <div className="flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-xl bg-dark-800/30 w-full overflow-hidden">
            <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-violet flex items-center justify-center">
              <HiOutlineUserCircle className="w-5 h-5 text-white" />
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-100 truncate">{user?.name}</p>
              <p className="text-xs text-dark-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 mt-2 w-full rounded-xl text-sm font-medium text-dark-400 hover:text-accent-rose hover:bg-accent-rose/10 transition-all duration-200"
          >
            <HiOutlineArrowRightOnRectangle className="w-6 h-6 lg:w-5 lg:h-5 shrink-0" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 lg:ml-64 min-w-0 transition-all duration-300">
        <div className="p-4 sm:p-8 lg:p-12 w-full max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
