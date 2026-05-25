import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api, { SERVER_URL } from '../api';

export default function AdminPage() {
  const { } = useAuth();

  const [tab, setTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [services,     setServices]     = useState([]);
  const [users,        setUsers]        = useState([]);
  const [masters,      setMasters]      = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loading,      setLoading]      = useState(true);

  const [newService, setNewService] = useState({
    name: '', description: '', price: '', duration: '', categoryId: '', masterId: ''
  });

  const [newMaster, setNewMaster] = useState({
    name: '', specialization: '', experience: '', login: '', password: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, u, m, c] = await Promise.all([
        api.get('/services'),
        api.get('/users'),
        api.get('/masters'),
        api.get('/categories'),
      ]);
      setServices(s.data);
      setUsers(u.data);
      setMasters(m.data);
      setCategories(c.data);
      const a = await api.get('/appointments');
      setAppointments(a.data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadData(); }, []);

  const handleDeleteService = async (id) => {
    if (!window.confirm('Удалить услугу?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch {
      alert('Ошибка удаления');
    }
  };

  const handleCreateService = async () => {
    try {
      const res = await api.post('/services', newService);
      setServices([...services, res.data]);
      setNewService({ name: '', description: '', price: '', duration: '', categoryId: '', masterId: '' });
    } catch {
      alert('Ошибка создания услуги');
    }
  };

  const handleCreateMaster = async () => {
    try {
      await api.post('/masters/create', newMaster);
      setNewMaster({ name: '', specialization: '', experience: '', login: '', password: '' });
      loadData();
    } catch {
      alert('Ошибка создания мастера');
    }
  };

  const handleCancelAppointment = async (id) => {
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
      case 'Новая':        return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'Подтверждена': return 'bg-green-50 text-green-500 border-green-100';
      case 'Завершена':    return 'bg-gray-50 text-gray-400 border-gray-100';
      case 'Отменена':     return 'bg-red-50 text-red-400 border-red-100';
      default:             return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const tabs = [
    { id: 'appointments', label: 'Записи',      icon: '📋' },
    { id: 'services',     label: 'Услуги',       icon: '✂️' },
    { id: 'masters',      label: 'Мастера',      icon: '👤' },
    { id: 'users',        label: 'Пользователи', icon: '👥' },
    { id: 'stats',        label: 'Статистика',   icon: '📊' },
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50 min-h-screen">
      {/* Декоративные жёлтые круги по бокам — в тон сайта */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* Левая сторона */}
        <div style={{
          position: 'absolute', left: '-90px', top: '120px',
          width: '260px', height: '260px',
          borderRadius: '50%', border: '4px solid #ca8a04', opacity: 0.18,
        }} />
        <div style={{
          position: 'absolute', left: '40px', top: '480px',
          width: '120px', height: '120px',
          borderRadius: '50%', border: '2px solid #ca8a04', opacity: 0.25,
        }} />
        <div style={{
          position: 'absolute', left: '-40px', bottom: '120px',
          width: '180px', height: '180px',
          borderRadius: '50%', border: '3px solid #ca8a04', opacity: 0.15,
        }} />
        {/* Правая сторона */}
        <div style={{
          position: 'absolute', right: '-90px', top: '180px',
          width: '280px', height: '280px',
          borderRadius: '50%', border: '5px solid #ca8a04', opacity: 0.18,
        }} />
        <div style={{
          position: 'absolute', right: '60px', top: '560px',
          width: '90px', height: '90px',
          borderRadius: '50%', border: '2px solid #ca8a04', opacity: 0.3,
        }} />
        <div style={{
          position: 'absolute', right: '-30px', bottom: '160px',
          width: '200px', height: '200px',
          borderRadius: '50%', border: '3px solid #ca8a04', opacity: 0.15,
        }} />
      </div>

      <div className="relative max-w-8xl mx-auto px-10 py-16 bg-white border-x border-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-light tracking-wide mb-2">Админ панель</h1>
        <p className="text-gray-400 mb-10">Управление салоном BeautyLine</p>
      </motion.div>

      <div className="flex gap-2 mb-10 border-b border-gray-100">
        {tabs.map((t, i) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 text-sm tracking-wide transition-all duration-300 ${
              tab === t.id ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            {t.icon} {t.label}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Записи */}
            {tab === 'appointments' && (
              <div>
                <h2 className="text-2xl font-light mb-6">Все записи ({appointments.length})</h2>
                <div className="space-y-3">
                  {appointments.map((a, i) => (
                    <motion.div key={a.id}
                      className="border border-gray-100 p-5 hover:border-yellow-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-light mb-1">{a.service?.name}</h3>
                          <p className="text-sm text-gray-400">Клиент: {a.user?.name || a.user?.login}</p>
                          <p className="text-sm text-gray-400">Мастер: {a.master?.name}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {new Date(a.dateTime).toLocaleString('ru-RU', {
                              day: '2-digit', month: 'long', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-light mb-2">{a.amount?.toLocaleString()} ₽</p>
                          <span className={`text-xs px-3 py-1 border ${statusColor(a.status?.name)}`}>
                            {a.status?.name}
                          </span>
                          {a.status?.name !== 'Отменена' && a.status?.name !== 'Завершена' && (
                            <div className="mt-2">
                              <button onClick={() => handleCancelAppointment(a.id)}
                                className="text-xs border border-red-200 text-red-400 px-3 py-1
                                           hover:bg-red-50 transition-all duration-300 hover:scale-105"
                              >Отменить</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Услуги */}
            {tab === 'services' && (
              <div>
                <h2 className="text-2xl font-light mb-6">Управление услугами</h2>
                <div className="border border-gray-100 p-6 mb-8">
                  <h3 className="text-lg font-light mb-4">Добавить услугу</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {[
                      { placeholder: 'Название',           key: 'name',        type: 'text'   },
                      { placeholder: 'Описание',           key: 'description', type: 'text'   },
                      { placeholder: 'Цена (руб)',         key: 'price',       type: 'number' },
                      { placeholder: 'Длительность (мин)', key: 'duration',    type: 'number' },
                    ].map(field => (
                      <input key={field.key} placeholder={field.placeholder} type={field.type}
                        value={newService[field.key]}
                        onChange={e => setNewService({...newService, [field.key]: e.target.value})}
                        className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                    ))}
                    <select value={newService.categoryId}
                      onChange={e => setNewService({...newService, categoryId: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={newService.masterId}
                      onChange={e => setNewService({...newService, masterId: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="">Выберите мастера</option>
                      {masters.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <button onClick={handleCreateService}
                    className="bg-black text-white px-6 py-2 text-sm tracking-widest uppercase
                               hover:bg-yellow-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >Добавить</button>
                </div>
                <div className="space-y-3">
                  {services.map((s, i) => (
                    <motion.div key={s.id}
                      className="border border-gray-100 p-5 flex items-center justify-between hover:border-yellow-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                          {s.photo ? (
                            <img src={`${SERVER_URL}${s.photo}`} alt={s.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">✂️</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-light">{s.name}</h3>
                          <p className="text-sm text-gray-400">{s.category?.name} · {s.duration} мин · Мастер: {s.master?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-light">{s.price?.toLocaleString()} ₽</p>
                        <label className="text-xs border border-gray-200 text-gray-500 px-3 py-1
                                          hover:bg-stone-50 transition-all duration-300 cursor-pointer hover:scale-105">
                          {s.photo ? 'Заменить' : 'Фото'}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('photo', file);
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`${SERVER_URL}/api/upload/service/${s.id}`, {
                                  method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
                                });
                                const data = await res.json();
                                setServices(services.map(service =>
                                  service.id === s.id ? { ...service, photo: data.photo } : service
                                ));
                              } catch { alert('Ошибка загрузки фото'); }
                            }}
                          />
                        </label>
                        <button onClick={() => handleDeleteService(s.id)}
                          className="text-xs border border-red-200 text-red-400 px-3 py-1
                                     hover:bg-red-50 transition-all duration-300 hover:scale-105"
                        >Удалить</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Мастера */}
            {tab === 'masters' && (
              <div>
                <h2 className="text-2xl font-light mb-6">Мастера ({masters.length})</h2>

                {/* Форма добавления */}
                <div className="border border-gray-100 p-6 mb-8">
                  <h3 className="text-lg font-light mb-4">Добавить мастера</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input placeholder="Имя мастера" value={newMaster.name}
                      onChange={e => setNewMaster({...newMaster, name: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input placeholder="Специализация" value={newMaster.specialization}
                      onChange={e => setNewMaster({...newMaster, specialization: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input placeholder="Опыт (например: 3 года)" value={newMaster.experience}
                      onChange={e => setNewMaster({...newMaster, experience: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input placeholder="Логин для входа" value={newMaster.login}
                      onChange={e => setNewMaster({...newMaster, login: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                    <input placeholder="Пароль" type="password" value={newMaster.password}
                      onChange={e => setNewMaster({...newMaster, password: e.target.value})}
                      className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <button onClick={handleCreateMaster}
                    className="bg-black text-white px-6 py-2 text-sm tracking-widest uppercase
                               hover:bg-yellow-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >Добавить мастера</button>
                </div>

                {/* Список */}
                <div className="space-y-4">
                  {masters.map((m, i) => (
                    <motion.div key={m.id}
                      className="border border-gray-100 p-5 flex items-center gap-6 hover:border-yellow-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
                        {m.photo ? (
                          <img src={`${SERVER_URL}${m.photo}`} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-lg">{m.name}</h3>
                        <p className="text-sm text-yellow-600">{m.specialization}</p>
                        <p className="text-sm text-gray-400">Стаж: {m.experience}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <label className="bg-black text-white px-4 py-2 text-xs tracking-widest uppercase
                                          hover:bg-yellow-600 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95">
                          {m.photo ? 'Заменить фото' : 'Загрузить фото'}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('photo', file);
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`${SERVER_URL}/api/upload/master/${m.id}`, {
                                  method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
                                });
                                const data = await res.json();
                                setMasters(masters.map(master =>
                                  master.id === m.id ? { ...master, photo: data.photo } : master
                                ));
                              } catch { alert('Ошибка загрузки фото'); }
                            }}
                          />
                        </label>
                        {m.photo && <span className="text-xs text-green-500">✓ Фото загружено</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Пользователи */}
            {tab === 'users' && (
              <div>
                <h2 className="text-2xl font-light mb-6">Пользователи ({users.length})</h2>
                <div className="space-y-3">
                  {users.map((u, i) => (
                    <motion.div key={u.id}
                      className="border border-gray-100 p-5 flex items-center justify-between hover:border-yellow-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div>
                        <h3 className="font-light">{u.name || u.login}</h3>
                        <p className="text-sm text-gray-400">{u.email}</p>
                      </div>
                      <span className="text-xs border border-yellow-200 text-yellow-600 px-3 py-1">
                        {u.role?.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Статистика */}
            {tab === 'stats' && (
              <div>
                <h2 className="text-2xl font-light mb-8">Статистика салона</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: 'Всего записей', value: appointments.length },
                    { label: 'Новые',         value: appointments.filter(a => a.status?.name === 'Новая').length },
                    { label: 'Завершённые',   value: appointments.filter(a => a.status?.name === 'Завершена').length },
                    { label: 'Отменённые',    value: appointments.filter(a => a.status?.name === 'Отменена').length },
                  ].map((stat, i) => (
                    <motion.div key={i}
                      className="border border-gray-100 p-6 text-center hover:border-yellow-400 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <p className="text-3xl font-light text-yellow-600 mb-1">{stat.value}</p>
                      <p className="text-xs tracking-widest uppercase text-gray-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div className="border border-gray-100 p-6 hover:border-yellow-400 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-light mb-4">Услуги</h3>
                    <p className="text-3xl font-light text-yellow-600">{services.length}</p>
                    <p className="text-sm text-gray-400 mt-1">активных услуг</p>
                  </motion.div>
                  <motion.div className="border border-gray-100 p-6 hover:border-yellow-400 transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-lg font-light mb-4">Выручка</h3>
                    <p className="text-3xl font-light text-yellow-600">
                      {appointments.filter(a => a.status?.name === 'Завершена')
                        .reduce((sum, a) => sum + a.amount, 0).toLocaleString()} ₽
                    </p>
                    <p className="text-sm text-gray-400 mt-1">по завершённым записям</p>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      </div>
    </div>
  );
}
