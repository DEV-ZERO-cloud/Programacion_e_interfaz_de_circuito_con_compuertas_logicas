import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { label: 'Operador', email: 'operador@pqr.com', password: 'operador123', role: 'operator' },
  { label: 'Supervisor', email: 'supervisor@pqr.com', password: 'supervisor123', role: 'supervisor' },
  { label: 'Usuario', email: 'usuario@pqr.com', password: 'usuario123', role: 'user' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Ingresa tu email y contraseña');
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      signIn(res.data.access_token, res.data.user);
      toast.success(`¡Bienvenido, ${res.data.user.full_name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand">
          Sistema<br /><span>de PQR</span>
        </div>
        <p className="tagline">
          Gestiona peticiones, quejas y reclamos de forma eficiente con nuestro sistema de seguimiento en tiempo real.
        </p>
        <ul className="feature-list">
          <li>3 roles diferenciados: Usuarios, Supervisores y Operadores</li>
          <li>Seguimiento del estado de cada solicitud en tiempo real</li>
          <li>Sistema de comentarios y notas de resolución</li>
          <li>Panel de estadísticas y métricas de gestión</li>
          <li>Asignación inteligente de casos a supervisores</li>
        </ul>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1>Iniciar sesión</h1>
          <p className="subtitle">Accede a tu panel de gestión de PQRs</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#94a3b8',
                    padding: 0, display: 'flex',
                  }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? <span className="spinner" /> : <><LogIn size={16} /> Ingresar</>}
            </button>
          </form>

          <div className="demo-accounts">
            <h4>Cuentas de demostración</h4>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                className="demo-btn"
                onClick={() => fillDemo(acc)}
                type="button"
              >
                <span className="demo-role">{acc.label}</span>
                <span style={{ color: '#94a3b8' }}>{acc.email}</span>
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
