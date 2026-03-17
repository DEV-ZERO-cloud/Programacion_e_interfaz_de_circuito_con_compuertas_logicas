import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api';
import { Avatar, RoleBadge, formatDateShort } from '../../components/Badges';
import { Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => toast.error('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = !search ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const ROLE_STATS = {
    user: users.filter((u) => u.role === 'user').length,
    supervisor: users.filter((u) => u.role === 'supervisor').length,
    operator: users.filter((u) => u.role === 'operator').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1>Usuarios del Sistema</h1>
        <p>Consulta todos los usuarios registrados en la plataforma</p>
      </div>

      {/* Role summary cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { key: 'user', label: 'Usuarios', color: '#6366f1', bg: '#e0e7ff' },
          { key: 'supervisor', label: 'Supervisores', color: '#ec4899', bg: '#fce7f3' },
          { key: 'operator', label: 'Operadores', color: '#f59e0b', bg: '#fef3c7' },
        ].map(({ key, label, color, bg }) => (
          <div
            key={key}
            className="stat-card"
            style={{ cursor: 'pointer', border: roleFilter === key ? `2px solid ${color}` : undefined }}
            onClick={() => setRoleFilter(roleFilter === key ? '' : key)}
          >
            <div className="stat-icon" style={{ background: bg }}>
              <Users size={22} color={color} />
            </div>
            <div className="stat-info">
              <div className="label">{label}</div>
              <div className="value">{ROLE_STATS[key]}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-control"
            style={{ paddingLeft: 32, width: 240 }}
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="supervisor">Supervisor</option>
          <option value="operator">Operador</option>
        </select>
        <div className="filter-spacer" />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            Cargando usuarios...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Users />
            <h3>No se encontraron usuarios</h3>
            <p>Prueba con otros filtros de búsqueda</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Registrado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} style={{ cursor: 'default' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.full_name} role={u.role} size={36} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.full_name}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>ID #{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: '#475569' }}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>{formatDateShort(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
