import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../api';

export default function LoginPage() {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { login, password });
      authLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)' }}
      className="bg-stone-50 flex items-center justify-center px-6">
      <motion.div
        className="bg-white p-10 w-full max-w-md border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light tracking-wide mb-2">Вход</h1>
        <p className="text-gray-400 text-sm mb-8">Введите свои данные для входа</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Логин</label>
            <input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Введите логин"
              required
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-gray-400 block mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Введите пароль"
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
            {loading ? 'Вхожу...' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-black hover:text-yellow-600 transition-colors">
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
