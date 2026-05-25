import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { SERVER_URL } from '../api';

export default function ServicesPage() {
  const [services,   setServices]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
    api.get('/services').then(r => {
      setServices(r.data);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory
    ? services.filter(s => s.categoryId === activeCategory)
    : services;

  return (
    <div className="max-w-8xl mx-auto px-6 py-16">
      <motion.h1
        className="text-4xl font-light tracking-wide mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Наши услуги
      </motion.h1>
      <motion.p
        className="text-gray-500 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Выберите услугу и запишитесь онлайн
      </motion.p>

      {/* Фильтр по категориям */}
      <motion.div
        className="flex flex-wrap gap-3 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 text-sm tracking-wide border transition-all duration-300 hover:scale-105 active:scale-95 ${
            activeCategory === null
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-black'
          }`}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 text-sm tracking-wide border transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-600 hover:border-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Список услуг */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-gray-100 animate-pulse">
              <div className="h-48 bg-gray-100"></div>
              <div className="p-6">
                <div className="h-3 bg-gray-100 rounded mb-3 w-1/3"></div>
                <div className="h-5 bg-gray-100 rounded mb-4 w-2/3"></div>
                <div className="h-3 bg-gray-100 rounded mb-4 w-1/4"></div>
                <div className="h-8 bg-gray-100 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                className="border border-gray-100 hover:border-yellow-400
                           transition-all duration-300 hover:shadow-md group overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -5 }}
              >
                {/* Фото услуги */}
                <div className="h-95 overflow-hidden bg-stone-100">
                  {service.photo ? (
                    <img
                      src={`${SERVER_URL}${service.photo}`}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">✂️</div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs tracking-widest text-yellow-600 uppercase mb-2">
                    {service.category?.name}
                  </p>
                  <h3 className="text-lg font-light mb-2 group-hover:text-yellow-600 transition-colors">
                    {service.name}
                  </h3>
                  {service.master && (
                    <p className="text-sm text-gray-400 mb-3">Мастер: {service.master.name}</p>
                  )}
                  <p className="text-sm text-gray-400 mb-4">{service.duration} мин</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-light">{service.price.toLocaleString()} ₽</p>
                    <Link
                      to="/booking"
                      className="text-sm tracking-wide border border-black px-4 py-2
                                 hover:bg-black hover:text-white transition-all duration-300
                                 hover:scale-105 active:scale-95"
                    >
                      Записаться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
