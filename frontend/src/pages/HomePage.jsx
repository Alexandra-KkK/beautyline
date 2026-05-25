import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { SERVER_URL } from '../api';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [masters, setMasters]   = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.slice(0, 6)));
    api.get('/masters').then(r => setMasters(r.data));
  }, []);

  return (
    <div>
      {/* Hero секция */}
      <section className="bg-black text-white min-h-screen flex items-center relative overflow-hidden">
        <div style={{
          position: 'absolute', right: '-80px', top: '50%',
          transform: 'translateY(-50%)', width: '520px', height: '520px',
          borderRadius: '50%', border: '6px solid #ca8a04', opacity: 0.2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '-20px', top: '50%',
          transform: 'translateY(-50%)', width: '360px', height: '360px',
          borderRadius: '50%', border: '3px solid #ca8a04', opacity: 0.15, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-60px', top: '-60px',
          width: '220px', height: '220px',
          borderRadius: '50%', border: '4px solid #ca8a04', opacity: 0.18, pointerEvents: 'none',
        }} />

        <div className="max-w-8xl mx-auto w-full" style={{ paddingLeft: '12%', paddingRight: '4rem', paddingTop: '5rem', paddingBottom: '5rem' }}>
          <motion.p
            className="text-yellow-500 tracking-widest text-sm uppercase mb-4"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Салон красоты премиум класса
          </motion.p>
          <motion.h1
            className="text-6xl md:text-8xl font-light leading-none mb-14"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            BEAUTY<br/>
            <span className="text-yellow-500">LINE</span>
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg max-w-md mb-14 leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Доверьте свою красоту профессионалам. Мы создаём образы, которые вдохновляют.
          </motion.p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Link to="/booking"
              className="bg-yellow-600 text-white px-12 py-4 text-sm tracking-widest uppercase
                         hover:bg-yellow-500 transition-all duration-300
                         hover:scale-105 hover:shadow-lg hover:shadow-yellow-900/40 active:scale-95"
            >
              Записаться
            </Link>
            <Link to="/services"
              className="border border-white text-white px-12 py-4 text-sm tracking-widest uppercase
                         hover:bg-white hover:text-black transition-all duration-300
                         hover:scale-105 active:scale-95"
            >
              Наши услуги
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={() => document.getElementById('why-us').scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-yellow-500 text-xs tracking-widest uppercase">Листай вниз</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Преимущества */}
      <section id="why-us" className="pt-32 pb-20 bg-stone-50">
        <div className="max-w-8xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-light tracking-wide text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            Почему выбирают нас
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Профессионалы', text: 'Наши мастера имеют многолетний опыт и регулярно проходят обучение', icon: '✦' },
              { title: 'Премиум уход',  text: 'Используем только сертифицированную косметику ведущих брендов',      icon: '✦' },
              { title: 'Ваш комфорт',  text: 'Уютная атмосфера и индивидуальный подход к каждому клиенту',         icon: '✦' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-8 bg-white border border-gray-100
                           hover:border-yellow-400 transition-all duration-300
                           hover:shadow-lg hover:-translate-y-1 cursor-default"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="text-yellow-500 text-2xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-light tracking-wide mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные услуги */}
      <section className="pt-32 pb-20">
        <div className="max-w-8xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-light tracking-wide text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            Популярные услуги
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                className="border border-gray-100 hover:border-yellow-400
                           transition-all duration-300 hover:shadow-md group
                           cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/booking?serviceId=${service.id}`)}
              >
                <div className="h-85 overflow-hidden bg-stone-100">
                  {service.photo ? (
                    <img
                      src={`${SERVER_URL}${service.photo}`}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">✂️</div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-widest text-yellow-600 uppercase mb-2">{service.category?.name}</p>
                  <h3 className="text-lg font-light mb-3 group-hover:text-yellow-600 transition-colors">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{service.duration} мин</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-light">{service.price.toLocaleString()} ₽</p>
                    <span className="text-xs tracking-wide border border-yellow-400 text-yellow-600 px-3 py-1
                                     group-hover:bg-yellow-400 group-hover:text-white transition-all duration-300">
                      Записаться
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/services"
              className="border border-black px-8 py-3 text-sm tracking-widest uppercase
                         hover:bg-black hover:text-white transition-all duration-300
                         hover:scale-105 active:scale-95 inline-block"
            >
              Все услуги
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Мастера */}
      <section className="pt-32 pb-20 bg-stone-50">
        <div className="max-w-8xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-light tracking-wide text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            Наши мастера
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {masters.map((master, i) => (
              <motion.div
                key={master.id}
                className="bg-white p-8 text-center border border-gray-100
                           hover:border-yellow-400 transition-all duration-300
                           hover:shadow-lg group cursor-default"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-stone-100
                                transition-transform duration-300 group-hover:scale-110">
                  {master.photo ? (
                    <img
                      src={`${SERVER_URL}${master.photo}`}
                      alt={master.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                  )}
                </div>
                <h3 className="text-lg font-light mb-1">{master.name}</h3>
                <p className="text-yellow-600 text-sm tracking-wide mb-2">{master.specialization}</p>
                <p className="text-gray-400 text-sm">Стаж: {master.experience}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Призыв к записи */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-8xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-light tracking-wide mb-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            Готовы преобразиться?
          </motion.h2>
          <motion.p
            className="text-gray-400 mb-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            Запишитесь онлайн прямо сейчас и получите консультацию бесплатно
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link to="/booking"
              className="bg-yellow-600 text-white px-10 py-4 text-sm tracking-widest uppercase
                         hover:bg-yellow-500 transition-all duration-300
                         hover:scale-105 hover:shadow-lg hover:shadow-yellow-900/40
                         active:scale-95 inline-block"
            >
              Записаться онлайн
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
