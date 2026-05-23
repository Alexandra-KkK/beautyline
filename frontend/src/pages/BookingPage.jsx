import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [services,        setServices]        = useState([]);
  const [masters,         setMasters]         = useState([]);
  const [categories,      setCategories]      = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);
  const [slots,           setSlots]           = useState([]);
  const [selectedDate,    setSelectedDate]    = useState('');
  const [showCalendar,    setShowCalendar]    = useState(false);
  const [calendarDate,    setCalendarDate]    = useState(new Date());

  const [payments] = useState([
    { id: 1, name: 'Наличные' },
    { id: 2, name: 'Банковская карта' },
    { id: 3, name: 'Подарочный сертификат' },
  ]);

  const [form, setForm] = useState({
    serviceId: '', masterId: '', dateTime: '', paymentMethodId: '',
  });

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [certCode,    setCertCode]    = useState('');
  const [certStatus,  setCertStatus]  = useState(null);
  const [certAmount,  setCertAmount]  = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([
      api.get('/services'),
      api.get('/masters'),
      api.get('/categories'),
    ]).then(([s, m, c]) => {
      setServices(s.data);
      setMasters(m.data);
      setCategories(c.data);
      const preselected = searchParams.get('serviceId');
      if (preselected) {
        setForm(f => ({ ...f, serviceId: preselected }));
        const service = s.data.find(sv => sv.id === parseInt(preselected));
        if (service?.masterId) {
          setFilteredMasters(m.data.filter(ms => ms.id === service.masterId));
        } else {
          setFilteredMasters(m.data);
        }
      } else {
        setFilteredMasters(m.data);
      }
    });
  }, [user, navigate, searchParams]);

  // Загружаем слоты когда выбраны мастер + дата + услуга
  useEffect(() => {
    if (!form.masterId || !selectedDate || !form.serviceId) { setSlots([]); return; }
    const service = services.find(s => s.id === parseInt(form.serviceId));
    if (!service) return;
    api.get('/appointments/slots', {
      params: { masterId: form.masterId, date: selectedDate, duration: service.duration }
    }).then(r => setSlots(r.data));
  }, [form.masterId, selectedDate, form.serviceId, services]);

  const handleServiceChange = (serviceId) => {
    setForm(f => ({ ...f, serviceId, masterId: '', dateTime: '' }));
    setSelectedDate('');
    setSlots([]);
    if (!serviceId) { setFilteredMasters(masters); return; }
    const service = services.find(s => s.id === parseInt(serviceId));
    if (service?.masterId) {
      setFilteredMasters(masters.filter(m => m.id === service.masterId));
    } else {
      setFilteredMasters(masters);
    }
  };

  const handleCertCheck = async () => {
    if (!certCode.trim()) return;
    try {
      const res = await api.post('/certificates/check', { code: certCode });
      setCertStatus('success');
      setCertAmount(res.data.amount);
    } catch {
      setCertStatus('error');
      setCertAmount(0);
    }
  };

  // Генерация дней календаря
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getFullYear()}`;
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const nearestSlots = slots.slice(0, 5);

  const selectedService = services.find(s => s.id === parseInt(form.serviceId));
  const selectedMaster  = masters.find(m => m.id === parseInt(form.masterId));
  const selectedPayment = payments.find(p => p.id === parseInt(form.paymentMethodId));
  const finalPrice = selectedService ? Math.max(0, selectedService.price - certAmount) : 0;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/appointments', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания записи');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: 'calc(100vh - 65px)' }}
        className="bg-stone-50 flex items-center justify-center px-6">
        <motion.div
          className="bg-white p-12 text-center border border-gray-100 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div className="text-yellow-500 text-5xl mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
          >✦</motion.div>
          <h2 className="text-3xl font-light tracking-wide mb-4">Запись создана!</h2>
          <p className="text-gray-400 mb-8">Мы свяжемся с вами для подтверждения</p>
          <button onClick={() => navigate('/profile')}
            className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase
                       hover:bg-yellow-600 transition-all duration-300 hover:scale-105 active:scale-95"
          >Мои записи</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)' }} className="bg-stone-50 py-16 px-6">
      <div className="max-w-8xl mx-auto bg-white border border-gray-100 p-12">

        <motion.h1 className="text-5xl font-light tracking-wide mb-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >Онлайн запись</motion.h1>
        <motion.p className="text-gray-400 mb-12 text-base"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >Заполните форму и мы подтвердим вашу запись</motion.p>

        <AnimatePresence>
          {error && (
            <motion.div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 mb-6"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >{error}</motion.div>
          )}
        </AnimatePresence>

        {/* Шаг 1 — Услуга */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">1. Выберите услугу</h2>
          <select value={form.serviceId} onChange={e => handleServiceChange(e.target.value)}
            className="w-full border border-gray-200 px-4 py-4 text-base
                       focus:outline-none focus:border-black transition-colors"
          >
            <option value="">Выберите услугу</option>
            {categories.map(cat => (
              <optgroup key={cat.id} label={cat.name}>
                {services.filter(s => s.categoryId === cat.id).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.price.toLocaleString()} ₽ ({s.duration} мин)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <AnimatePresence>
            {selectedService && (
              <motion.div className="mt-3 px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                Выбрана услуга: <span className="font-medium">{selectedService.name}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Шаг 2 — Мастер */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">2. Выберите мастера</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredMasters.map(master => (
              <button key={master.id}
                onClick={() => { setForm({ ...form, masterId: master.id.toString(), dateTime: '' }); setSelectedDate(''); setSlots([]); }}
                className={`p-5 border text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                  form.masterId === master.id.toString()
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <p className="text-base font-light">{master.name}</p>
                <p className={`text-sm mt-1 ${form.masterId === master.id.toString() ? 'text-gray-300' : 'text-gray-400'}`}>
                  {master.specialization}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Шаг 3 — Дата и время */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">3. Выберите дату и время</h2>

          {/* Выбор даты */}
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => { setSelectedDate(e.target.value); setForm(f => ({ ...f, dateTime: '' })); }}
            className="w-full border border-gray-200 px-4 py-4 text-base mb-4
                       focus:outline-none focus:border-black transition-colors"
          />

          {/* Слоты времени */}
          <AnimatePresence>
            {selectedDate && form.masterId && form.serviceId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {slots.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">Нет свободных слотов на эту дату</p>
                ) : (
                  <>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">
                      Ближайшее время {formatDate(selectedDate)}:
                    </p>

                    {/* Быстрые слоты */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {nearestSlots.map(slot => (
                        <button key={slot}
                          onClick={() => setForm(f => ({ ...f, dateTime: slot }))}
                          className={`px-4 py-2 text-sm border transition-all duration-300 hover:scale-105 active:scale-95 ${
                            form.dateTime === slot
                              ? 'bg-black text-white border-black'
                              : 'border-gray-200 hover:border-black'
                          }`}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                      {slots.length > 5 && (
                        <button
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="px-4 py-2 text-sm border border-yellow-400 text-yellow-600
                                     hover:bg-yellow-400 hover:text-white transition-all duration-300"
                        >
                          Другое время
                        </button>
                      )}
                    </div>

                    {/* Все слоты */}
                    <AnimatePresence>
                      {showCalendar && (
                        <motion.div
                          className="border border-gray-100 p-4 mt-2"
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">Все свободное время:</p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(slot => (
                              <button key={slot}
                                onClick={() => { setForm(f => ({ ...f, dateTime: slot })); setShowCalendar(false); }}
                                className={`px-4 py-2 text-sm border transition-all duration-300 hover:scale-105 ${
                                  form.dateTime === slot
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-200 hover:border-black'
                                }`}
                              >
                                {formatTime(slot)}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!form.masterId || !form.serviceId ? (
            <p className="text-sm text-gray-400 mt-2">Сначала выберите услугу и мастера</p>
          ) : null}
        </motion.div>

        {/* Шаг 4 — Оплата */}
        <motion.div className="mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xs tracking-widest uppercase text-gray-400 mb-4">4. Способ оплаты</h2>
          <div className="relative">
            <button onClick={() => setPaymentOpen(!paymentOpen)}
              className="w-full border border-gray-200 px-4 py-4 text-base text-left
                         flex items-center justify-between hover:border-black transition-colors"
            >
              <span className={selectedPayment ? 'text-black' : 'text-gray-400'}>
                {selectedPayment ? selectedPayment.name : 'Выберите способ оплаты'}
              </span>
              <motion.span animate={{ rotate: paymentOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>▼</motion.span>
            </button>
            <AnimatePresence>
              {paymentOpen && (
                <motion.div
                  className="absolute top-full left-0 right-0 bg-white border border-gray-200 border-t-0 z-10"
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                >
                  {payments.map(p => (
                    <button key={p.id}
                      onClick={() => {
                        setForm({ ...form, paymentMethodId: p.id.toString() });
                        setPaymentOpen(false);
                        if (p.id !== 3) { setCertCode(''); setCertStatus(null); setCertAmount(0); }
                      }}
                      className={`w-full px-4 py-4 text-base text-left transition-colors hover:bg-stone-50 ${
                        form.paymentMethodId === p.id.toString() ? 'bg-stone-50 font-medium' : ''
                      }`}
                    >{p.name}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {form.paymentMethodId === '3' && (
              <motion.div className="mt-4"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              >
                <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Номер сертификата</p>
                <div className="flex gap-2">
                  <input type="text" value={certCode}
                    onChange={e => { setCertCode(e.target.value); setCertStatus(null); }}
                    placeholder="Введите номер сертификата"
                    className="flex-1 border border-gray-200 px-4 py-4 text-base
                               focus:outline-none focus:border-black transition-colors"
                  />
                  <button onClick={handleCertCheck}
                    className="bg-black text-white px-6 py-4 text-sm tracking-wide
                               hover:bg-yellow-600 transition-all duration-300"
                  >Применить</button>
                </div>
                <AnimatePresence>
                  {certStatus === 'success' && (
                    <motion.p className="mt-2 text-sm text-green-600"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >✓ Сертификат применён — скидка {certAmount.toLocaleString()} ₽</motion.p>
                  )}
                  {certStatus === 'error' && (
                    <motion.p className="mt-2 text-sm text-red-500"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >✗ Сертификат не найден или уже использован</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Итог */}
        <AnimatePresence>
          {selectedService && (
            <motion.div className="bg-stone-50 p-6 mb-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
            >
              <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Ваша запись</h3>
              <div className="flex justify-between text-base mb-3">
                <span className="text-gray-500">Услуга</span>
                <span>{selectedService.name}</span>
              </div>
              {selectedMaster && (
                <div className="flex justify-between text-base mb-3">
                  <span className="text-gray-500">Мастер</span>
                  <span>{selectedMaster.name}</span>
                </div>
              )}
              {form.dateTime && (
                <div className="flex justify-between text-base mb-3">
                  <span className="text-gray-500">Дата и время</span>
                  <span>{formatDate(form.dateTime)} в {formatTime(form.dateTime)}</span>
                </div>
              )}
              {certStatus === 'success' && (
                <div className="flex justify-between text-base mb-3 text-green-600">
                  <span>Сертификат</span>
                  <span>− {certAmount.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-4 mt-2">
                <span className="text-gray-500 text-base">Итого</span>
                <span className="text-2xl font-light">{finalPrice.toLocaleString()} ₽</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button onClick={handleSubmit}
          disabled={!form.serviceId || !form.masterId || !form.dateTime || loading}
          className="w-full bg-black text-white py-5 text-sm tracking-widest uppercase
                     hover:bg-yellow-600 transition-all duration-300
                     disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {loading ? 'Создаю запись...' : 'Подтвердить запись'}
        </motion.button>
      </div>
    </div>
  );
}
