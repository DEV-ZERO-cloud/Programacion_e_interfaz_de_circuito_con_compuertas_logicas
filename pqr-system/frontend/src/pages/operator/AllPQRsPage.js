import React, { useEffect, useState } from 'react';
import { getPQRs, getSupervisors } from '../../api';
import { StatusBadge, TypeBadge, PriorityBadge, formatDateShort, Avatar } from '../../components/Badges';
import PQRDetailModal from '../../components/PQRDetailModal';
import { ClipboardList, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllPQRsPage() {
  const [pqrs, setPQRs] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: '', pqr_type: '', priority: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, [filters]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.pqr_type) params.pqr_type = filters.pqr_type;
      if (filters.priority) params.priority = filters.priority;
      const [pqrRes, supRes] = await Promise.all([getPQRs(params), getSupervisors()]);
      setPQRs(pqrRes.data);
      setSupervisors(supRes.data);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const filtered = pqrs.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.created_by?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['ID', 'Título', 'Tipo', 'Estado', 'Prioridad', 'Creado por', 'Asignado a', 'Fecha'];
    const rows = filtered.map((p) => [
      p.id,
      `"${p.title}"`,
      p.pqr_type,
      p.status,
      p.priority,
      p.created_by?.full_name || '',
      p.assigned_to?.full_name || '',
      p.created_at ? new Date(p.created_at).toLocaleDateString('es-CO') : '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pqrs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Todas las PQRs</h1>
            <p>Vista completa de todas las solicitudes del sistema</p>
          </div>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={15} /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="form-control"
            style={{ paddingLeft: 32, width: 240 }}
            placeholder="Buscar por título o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
        <select value={filters.pqr_type} onChange={(e) => setFilters({ ...filters, pqr_type: e.target.value })}>
          <option value="">Todos los tipos</option>
          <option value="peticion">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
        <div className="filter-spacer" />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>
          {filtered.length} de {pqrs.length} PQRs
        </span>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            Cargando todas las PQRs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ClipboardList />
            <h3>No hay PQRs que mostrar</h3>
            <p>Prueba con otros filtros o crea nuevas solicitudes</p>
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
                  <th>Asignado a</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pqr) => (
                  <tr key={pqr.id} onClick={() => setSelected(pqr)}>
                    <td style={{ fontWeight: 600, color: '#f59e0b' }}>#{pqr.id}</td>
                    <td style={{ fontWeight: 500, maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pqr.title}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={pqr.created_by?.full_name} role="user" size={26} />
                        <span style={{ fontSize: 12 }}>{pqr.created_by?.full_name || '—'}</span>
                      </div>
                    </td>
                    <td><TypeBadge type={pqr.pqr_type} /></td>
                    <td><StatusBadge status={pqr.status} /></td>
                    <td><PriorityBadge priority={pqr.priority} /></td>
                    <td>
                      {pqr.assigned_to ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Avatar name={pqr.assigned_to.full_name} role="supervisor" size={22} />
                          <span style={{ fontSize: 12 }}>{pqr.assigned_to.full_name}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Sin asignar</span>
                      )}
                    </td>
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
          onUpdate={fetchAll}
          supervisors={supervisors}
        />
      )}
    </div>
  );
}
