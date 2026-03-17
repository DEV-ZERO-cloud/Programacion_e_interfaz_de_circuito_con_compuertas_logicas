import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList, Clock, CheckCircle, XCircle,
  TrendingUp, AlertTriangle, Inbox, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_SUBTITLES = {
  user: 'Aquí puedes ver el resumen de tus solicitudes.',
  supervisor: 'Estas son las PQRs asignadas a ti para gestionar.',
  operator: 'Vista global de todas las PQRs del sistema.',
};

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total PQRs',
    icon: ClipboardList,
    color: '#6366f1',
    bg: '#e0e7ff',
  },
  {
    key: 'pendiente',
    label: 'Pendientes',
    icon: Clock,
    color: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    key: 'en_proceso',
    label: 'En Proceso',
    icon: RefreshCw,
    color: '#0ea5e9',
    bg: '#e0f2fe',
  },
  {
    key: 'resuelto',
    label: 'Resueltas',
    icon: CheckCircle,
    color: '#10b981',
    bg: '#d1fae5',
  },
];

const TYPE_COLORS = {
  peticion: { color: '#6366f1', bg: '#e0e7ff', label: 'Peticiones' },
  queja: { color: '#ec4899', bg: '#fce7f3', label: 'Quejas' },
  reclamo: { color: '#f97316', bg: '#ffedd5', label: 'Reclamos' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch {
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const ROLE_GRADIENT = {
    user: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    supervisor: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    operator: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: ROLE_GRADIENT[user?.role],
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 28,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
            ¡Hola, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ opacity: 0.85, fontSize: 15 }}>
            {ROLE_SUBTITLES[user?.role]}
          </p>
        </div>
        <div style={{ opacity: 0.2, fontSize: 80 }}>📋</div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Cargando estadísticas...</div>
      ) : (
        <>
          <div className="stats-grid">
            {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
              <div key={key} className="stat-card">
                <div className="stat-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="stat-info">
                  <div className="label">{label}</div>
                  <div className="value">{stats?.[key] ?? 0}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Type breakdown */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3>Distribución por Tipo</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {Object.entries(TYPE_COLORS).map(([type, { color, bg, label }]) => {
                  const count = stats?.por_tipo?.[type] ?? 0;
                  const total = stats?.total || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div
                      key={type}
                      style={{
                        background: bg,
                        borderRadius: 12,
                        padding: 20,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 32, fontWeight: 700, color, marginBottom: 4 }}>
                        {count}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 6 }}>
                        {label}
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 3,
                          background: 'rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            background: color,
                            borderRadius: 3,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color, marginTop: 4, opacity: 0.8 }}>
                        {pct}% del total
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status progress */}
          <div className="card">
            <div className="card-header">
              <h3>Estado General</h3>
            </div>
            <div className="card-body">
              {[
                { key: 'pendiente', label: 'Pendiente', color: '#f59e0b' },
                { key: 'en_proceso', label: 'En Proceso', color: '#0ea5e9' },
                { key: 'resuelto', label: 'Resuelto', color: '#10b981' },
                { key: 'cerrado', label: 'Cerrado', color: '#94a3b8' },
              ].map(({ key, label, color }) => {
                const count = stats?.[key] ?? 0;
                const total = stats?.total || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span style={{ fontWeight: 500, color: '#475569' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: color,
                          borderRadius: 4,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
