import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function RegisterPage() {
  const [form,    setForm]    = useState({ login: '', email: '', password: '', name: '', phone: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      authLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)' }}
      className="bg-stone-50 flex items-center justify-center px-6 py-12">
      <motion.div
        className="bg-white p-10 w-full max-w-md border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light tracking-wide mb-2">Регистрация</h1>
        <p className="text-gray-400 text-sm mb-8">Создайте аккаунт чтобы записываться онлайн</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Имя</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Логин</label>
            <input
              type="text"
              name="login"
              value={form.login}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Придумайте логин"
              required
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Ваш email"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Телефон</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Пароль</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Придумайте пароль"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-4 text-sm tracking-widest uppercase
                       hover:bg-yellow-600 transition-all duration-300
                       hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Регистрирую...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-black hover:text-yellow-600 transition-colors">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
