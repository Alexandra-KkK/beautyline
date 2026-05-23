import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-light tracking-widest mb-4">
              BEAUTY<span className="text-yellow-500">LINE</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Салон красоты премиум класса. Мы заботимся о вашей красоте и здоровье.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-sm tracking-widest uppercase text-gray-400 mb-4">Навигация</h4>
            <div className="flex flex-col gap-2 items-center">
              <Link to="/"         className="text-sm text-gray-300 hover:text-yellow-500 transition-colors">Главная</Link>
              <Link to="/services" className="text-sm text-gray-300 hover:text-yellow-500 transition-colors">Услуги</Link>
              <Link to="/booking"  className="text-sm text-gray-300 hover:text-yellow-500 transition-colors">Онлайн запись</Link>
              <Link to="/login"    className="text-sm text-gray-300 hover:text-yellow-500 transition-colors">Личный кабинет</Link>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-sm tracking-widest uppercase text-gray-400 mb-4">Контакты</h4>
            <div className="flex flex-col gap-2 items-center md:items-end">
              <p className="text-sm text-gray-300">📍 Санкт-Петербург, ул. Невский пр., 1</p>
              <p className="text-sm text-gray-300">📞 +7 (911) 749-78-36</p>
              <p className="text-sm text-gray-300">✉️ info@beautyline.ru</p>
              <p className="text-sm text-gray-300">🕐 Пн-Вс: 9:00 — 21:00</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2026 BeautyLine. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
