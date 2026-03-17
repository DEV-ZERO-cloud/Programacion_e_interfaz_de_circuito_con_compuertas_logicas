import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { getPQR, updatePQR, addComment } from '../api';
import {
  StatusBadge, TypeBadge, PriorityBadge, Avatar, formatDate,
} from './Badges';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'cerrado', label: 'Cerrado' },
];

const PRIORITY_OPTIONS = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' },
];

export default function PQRDetailModal({ pqr: initialPQR, onClose, onUpdate, supervisors = [] }) {
  const { user } = useAuth();
  const [pqr, setPQR] = useState(initialPQR);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const canEdit = user?.role === 'operator' || user?.role === 'supervisor';
  const canEditUser = user?.role === 'user' && pqr.status === 'pendiente';

  const refreshPQR = async () => {
    try {
      const res = await getPQR(pqr.id);
      setPQR(res.data);
    } catch (e) {}
  };

  const startEdit = () => {
    setEditData({
      status: pqr.status,
      priority: pqr.priority,
      resolution_notes: pqr.resolution_notes || '',
      assigned_to_id: pqr.assigned_to_id || '',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {};
      if (user?.role === 'operator') {
        if (editData.status) payload.status = editData.status;
        if (editData.priority) payload.priority = editData.priority;
        if (editData.resolution_notes) payload.resolution_notes = editData.resolution_notes;
        if (editData.assigned_to_id) payload.assigned_to_id = Number(editData.assigned_to_id);
      } else if (user?.role === 'supervisor') {
        if (editData.status) payload.status = editData.status;
        if (editData.priority) payload.priority = editData.priority;
        if (editData.resolution_notes) payload.resolution_notes = editData.resolution_notes;
      }
      await updatePQR(pqr.id, payload);
      await refreshPQR();
      setEditing(false);
      toast.success('PQR actualizada correctamente');
      if (onUpdate) onUpdate();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await addComment(pqr.id, comment.trim());
      setComment('');
      await refreshPQR();
      toast.success('Comentario agregado');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error al comentar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <h2>#{pqr.id} — {pqr.title}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Meta badges */}
          <div className="pqr-meta">
            <TypeBadge type={pqr.pqr_type} />
            <StatusBadge status={pqr.status} />
            <PriorityBadge priority={pqr.priority} />
            {pqr.category && (
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                {pqr.category}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="pqr-description">{pqr.description}</div>

          {/* Details grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <div className="label">Creado por</div>
              <div className="value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar name={pqr.created_by?.full_name} role="user" size={22} />
                {pqr.created_by?.full_name || '—'}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Fecha de creación</div>
              <div className="value">{formatDate(pqr.created_at)}</div>
            </div>
            <div className="detail-item">
              <div className="label">Asignado a</div>
              <div className="value">
                {pqr.assigned_to ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={pqr.assigned_to.full_name} role="supervisor" size={22} />
                    {pqr.assigned_to.full_name}
                  </span>
                ) : (
                  <span className="text-muted">Sin asignar</span>
                )}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Última actualización</div>
              <div className="value">{formatDate(pqr.updated_at) || formatDate(pqr.created_at)}</div>
            </div>
          </div>

          {/* Resolution notes */}
          {pqr.resolution_notes && !editing && (
            <div className="resolution-box">
              <div className="label">Notas de resolución</div>
              <p>{pqr.resolution_notes}</p>
            </div>
          )}

          {/* Edit form for supervisor / operator */}
          {editing && canEdit && (
            <div className="card" style={{ marginTop: 16 }}>
              <div className="card-body">
                <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Actualizar PQR</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-control"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prioridad</label>
                    <select
                      className="form-control"
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    >
                      {PRIORITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {user?.role === 'operator' && supervisors.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Asignar a Supervisor</label>
                    <select
                      className="form-control"
                      value={editData.assigned_to_id}
                      onChange={(e) => setEditData({ ...editData, assigned_to_id: e.target.value })}
                    >
                      <option value="">Sin asignar</option>
                      {supervisors.map((s) => (
                        <option key={s.id} value={s.id}>{s.full_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Notas de resolución</label>
                  <textarea
                    className="form-control"
                    value={editData.resolution_notes}
                    onChange={(e) => setEditData({ ...editData, resolution_notes: e.target.value })}
                    placeholder="Descripción de la acción tomada..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="comments-section">
            <h4>Comentarios ({pqr.comments?.length || 0})</h4>
            {(pqr.comments || []).length === 0 ? (
              <p className="text-muted text-sm">Sin comentarios aún.</p>
            ) : (
              pqr.comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <Avatar name={c.user?.full_name} role={c.user?.role} size={32} />
                  <div className="comment-content">
                    <div className="comment-author">
                      <span>{c.user?.full_name || 'Usuario'}</span>
                      <span className="comment-date">{formatDate(c.created_at)}</span>
                    </div>
                    <div className="comment-text">{c.content}</div>
                  </div>
                </div>
              ))
            )}

            <form className="comment-form" onSubmit={handleComment}>
              <input
                className="form-control"
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !comment.trim()}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          {canEdit && !editing && (
            <button className="btn btn-primary" onClick={startEdit}>
              Editar PQR
            </button>
          )}
          {canEdit && editing && (
            <>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? <span className="spinner" /> : 'Guardar cambios'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
