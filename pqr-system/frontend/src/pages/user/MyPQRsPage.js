import React, { useEffect, useState } from 'react';
import { getPQRs } from '../../api';
import { StatusBadge, TypeBadge, PriorityBadge, formatDateShort } from '../../components/Badges';
import PQRDetailModal from '../../components/PQRDetailModal';
import { FilePlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyPQRsPage() {
  const [pqrs, setPQRs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: '', pqr_type: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPQRs();
  }, [filters]);

  const fetchPQRs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.pqr_type) params.pqr_type = filters.pqr_type;
      const res = await getPQRs(params);
      setPQRs(res.data);
    } catch {
      toast.error('Error al cargar tus PQRs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = pqrs.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Mis PQRs</h1>
            <p>Consulta y realiza seguimiento de todas tus solicitudes</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/crear-pqr')}>
            <FilePlus size={16} /> Nueva PQR
          </button>
        </div>
      </div>

      {/* Filters */}
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
          value={filters.pqr_type}
          onChange={(e) => setFilters({ ...filters, pqr_type: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
        </select>
        <div className="filter-spacer" />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            Cargando tus PQRs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FilePlus />
            <h3>No tienes PQRs aún</h3>
            <p>Crea tu primera solicitud haciendo clic en "Nueva PQR"</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Categoría</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pqr) => (
                  <tr key={pqr.id} onClick={() => setSelected(pqr)}>
                    <td style={{ fontWeight: 600, color: '#6366f1' }}>#{pqr.id}</td>
                    <td style={{ fontWeight: 500, maxWidth: 240 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pqr.title}
                      </div>
                    </td>
                    <td><TypeBadge type={pqr.pqr_type} /></td>
                    <td><StatusBadge status={pqr.status} /></td>
                    <td><PriorityBadge priority={pqr.priority} /></td>
                    <td style={{ color: '#64748b' }}>{pqr.category || '—'}</td>
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
