import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function MasterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'Master') {
      navigate('/');
      return;
    }
    api.get('/appointments/master')
      .then(r => setAppointments(r.data))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleStatus = async (id, statusId) => {
    try {
      await api.put(`/appointments/${id}/status`, { statusId });
      api.get('/appointments').then(r => setAppointments(r.data));
    } catch {
      alert('Ошибка обновления статуса');
    }
  };

  const statusColor = (name) => {
    switch(name) {
      case 'Новая':        return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'Подтверждена': return 'bg-green-50 text-green-500 border-green-100';
      case 'Завершена':    return 'bg-gray-50 text-gray-400 border-gray-100';
      case 'Отменена':     return 'bg-red-50 text-red-400 border-red-100';
      default:             return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const myAppointments = appointments;

  const stats = [
    { label: 'Всего записей',  value: myAppointments.length },
    { label: 'Новые',          value: myAppointments.filter(a => a.status?.name === 'Новая').length },
    { label: 'Подтверждённые', value: myAppointments.filter(a => a.status?.name === 'Подтверждена').length },
    { label: 'Завершённые',    value: myAppointments.filter(a => a.status?.name === 'Завершена').length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light tracking-wide mb-2">Панель мастера</h1>
        <p className="text-gray-400 mb-12">Добро пожаловать, {user?.name}</p>
      </motion.div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="border border-gray-100 p-6 text-center hover:border-yellow-400 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <p className="text-3xl font-light text-yellow-600 mb-1">{stat.value}</p>
            <p className="text-xs tracking-widest uppercase text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="text-2xl font-light tracking-wide mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Моё расписание
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
      ) : myAppointments.length === 0 ? (
        <motion.div
          className="text-center py-16 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>У вас пока нет записей</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {myAppointments.map((appointment, i) => (
              <motion.div
                key={appointment.id}
                className="border border-gray-100 p-6 hover:border-yellow-400 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-light mb-1">{appointment.service?.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">
                      Клиент: {appointment.user?.name || appointment.user?.login}
                    </p>
                    <p className="text-sm text-gray-400 mb-3">
                      {new Date(appointment.dateTime).toLocaleString('ru-RU', {
                        day: '2-digit', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <span className={`text-xs px-3 py-1 border ${statusColor(appointment.status?.name)}`}>
                      {appointment.status?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-light mb-3">{appointment.amount?.toLocaleString()} ₽</p>
                    <div className="flex flex-col gap-2">
                      {appointment.status?.name === 'Новая' && (
                        <motion.button
                          onClick={() => handleStatus(appointment.id, 1)}
                          className="text-xs border border-green-200 text-green-500 px-3 py-2
                                     hover:bg-green-50 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Подтвердить
                        </motion.button>
                      )}
                      {appointment.status?.name === 'Подтверждена' && (
                        <motion.button
                          onClick={() => handleStatus(appointment.id, 3)}
                          className="text-xs border border-gray-200 text-gray-500 px-3 py-2
                                     hover:bg-gray-50 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Завершить
                        </motion.button>
                      )}
                    </div>
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
