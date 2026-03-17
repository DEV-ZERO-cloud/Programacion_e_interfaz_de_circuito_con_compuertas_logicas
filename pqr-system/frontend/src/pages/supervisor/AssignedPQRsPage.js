import React, { useEffect, useState } from 'react';
import { getPQRs } from '../../api';
import { StatusBadge, TypeBadge, PriorityBadge, formatDateShort, Avatar } from '../../components/Badges';
import PQRDetailModal from '../../components/PQRDetailModal';
import { ShieldCheck, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AssignedPQRsPage() {
  const [pqrs, setPQRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPQRs();
  }, [filters]);

  const fetchPQRs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await getPQRs(params);
      setPQRs(res.data);
    } catch {
      toast.error('Error al cargar las PQRs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = pqrs.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>PQRs Asignadas</h1>
        <p>Gestiona las solicitudes que te han sido asignadas</p>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-control"
            style={{ paddingLeft: 32, width: 220 }}
            placeholder="Buscar PQR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        <div className="filter-spacer" />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            Cargando PQRs asignadas...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ShieldCheck />
            <h3>No tienes PQRs asignadas</h3>
            <p>Cuando el operador te asigne solicitudes, aparecerán aquí</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Solicitante</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pqr) => (
                  <tr key={pqr.id} onClick={() => setSelected(pqr)}>
                    <td style={{ fontWeight: 600, color: '#ec4899' }}>#{pqr.id}</td>
                    <td style={{ fontWeight: 500, maxWidth: 220 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pqr.title}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={pqr.created_by?.full_name} role="user" size={26} />
                        <span style={{ fontSize: 13 }}>{pqr.created_by?.full_name || '—'}</span>
                      </div>
                    </td>
                    <td><TypeBadge type={pqr.pqr_type} /></td>
                    <td><StatusBadge status={pqr.status} /></td>
                    <td><PriorityBadge priority={pqr.priority} /></td>
                    <td style={{ color: '#94a3b8', fontSize: 12 }}>{formatDateShort(pqr.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <PQRDetailModal
          pqr={selected}
          onClose={() => setSelected(null)}
          onUpdate={fetchPQRs}
        />
      )}
    </div>
  );
}
