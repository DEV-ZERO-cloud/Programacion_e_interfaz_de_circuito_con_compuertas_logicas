import React from 'react';

const ROLE_COLORS = {
  user: '#6366f1',
  supervisor: '#ec4899',
  operator: '#f59e0b',
};

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

const TYPE_LABELS = {
  peticion: 'Petición',
  queja: 'Queja',
  reclamo: 'Reclamo',
};

const PRIORITY_LABELS = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span className={`badge badge-${type}`}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-${priority}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export function RoleBadge({ role }) {
  const labels = { user: 'Usuario', supervisor: 'Supervisor', operator: 'Operador' };
  return (
    <span className={`role-badge badge-${role}`}>
      {labels[role] || role}
    </span>
  );
}

export function Avatar({ name, size = 36, role }) {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const color = ROLE_COLORS[role] || '#6366f1';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: size * 0.37,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
