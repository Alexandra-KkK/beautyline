import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/appointments/my')
      .then(r => setAppointments(r.data))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: { name: 'Отменена' } } : a
      ));
    } catch {
      alert('Ошибка отмены записи');
    }
  };

  const statusColor = (name) => {
    switch(name) {
      case 'Новая':        return 'text-blue-500';
      case 'Подтверждена': return 'text-green-500';
      case 'Завершена':    return 'text-gray-400';
      case 'Отменена':     return 'text-red-400';
      default:             return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div
        className="flex items-center justify-between mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-light tracking-wide mb-2">Личный кабинет</h1>
          <p className="text-gray-400">Добро пожаловать, {user?.name || user?.login}</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="border border-gray-200 px-6 py-2 text-sm tracking-wide
                     hover:border-black transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Выйти
        </button>
      </motion.div>

      <motion.div
        className="bg-stone-50 p-6 mb-10 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-lg font-light tracking-wide mb-4">Мои данные</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Логин</p>
            <p className="text-sm">{user?.login}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Роль</p>
            <p className="text-sm">{user?.role}</p>
          </div>
        </div>
      </motion.div>

      <motion.h2
        className="text-2xl font-light tracking-wide mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        Мои записи
      </motion.h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <motion.div
          className="text-center py-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg mb-4">У вас пока нет записей</p>
          <a href="/booking" className="border border-black px-6 py-3 text-sm tracking-widest uppercase
                                        hover:bg-black hover:text-white transition-all duration-300">
            Записаться
          </a>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {appointments.map((appointment, i) => (
              <motion.div
                key={appointment.id}
                className="border border-gray-100 p-6 hover:border-yellow-400 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-light mb-1">{appointment.service?.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">Мастер: {appointment.master?.name}</p>
                    <p className="text-sm text-gray-400 mb-3">
                      {new Date(appointment.dateTime).toLocaleString('ru-RU', {
                        day: '2-digit', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <span className={`text-sm font-light ${statusColor(appointment.status?.name)}`}>
                      {appointment.status?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-light mb-3">{appointment.amount?.toLocaleString()} ₽</p>
                    {appointment.status?.name === 'Новая' && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="text-sm text-red-400 border border-red-200 px-4 py-2
                                   hover:bg-red-50 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
