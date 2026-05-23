import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/',         label: 'Главная' },
    { to: '/services', label: 'Услуги' },
    { to: '/booking',  label: 'Запись' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-light tracking-widest text-black
                                hover:text-yellow-600 transition-colors duration-300">
          BEAUTY<span className="text-yellow-600">LINE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="relative text-sm tracking-wide text-gray-600 hover:text-black transition-colors group"
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-px bg-yellow-500 transition-all duration-300
                ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
            </Link>
          ))}
          {user?.role === 'Admin' && (
            <Link to="/admin"
              className="relative text-sm tracking-wide text-yellow-600 hover:text-yellow-500 transition-colors group"
            >
              Админ панель
              <span className="absolute -bottom-1 left-0 h-px bg-yellow-500 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          )}
          {user?.role === 'Master' && (
            <Link to="/master"
              className="relative text-sm tracking-wide text-yellow-600 hover:text-yellow-500 transition-colors group"
            >
              Моё расписание
              <span className="absolute -bottom-1 left-0 h-px bg-yellow-500 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          )}
        </nav>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {user ? (
            <>
              <Link to="/profile"
                className="text-sm tracking-wide text-gray-600 hover:text-black transition-colors"
              >
                {user.name || user.login}
              </Link>
              <button
                onClick={logout}
                className="text-sm tracking-wide text-gray-400 hover:text-black transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm tracking-wide text-gray-600 hover:text-black transition-colors"
              >
                Войти
              </Link>
              <Link to="/register"
                className="bg-black text-white text-sm tracking-wide px-5 py-2
                           hover:bg-yellow-600 transition-all duration-300
                           hover:scale-105 active:scale-95"
              >
                Регистрация
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </header>
  );
}
