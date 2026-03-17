import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPQR } from '../../api';
import toast from 'react-hot-toast';
import { Send, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Servicios generales',
  'Facturación',
  'Atención al cliente',
  'Producto / Servicio',
  'Infraestructura',
  'Otro',
];

export default function CreatePQRPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    pqr_type: 'peticion',
    priority: 'media',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Título y descripción son requeridos');
      return;
    }
    setLoading(true);
    try {
      const res = await createPQR(form);
      toast.success('PQR creada exitosamente');
      navigate('/mis-pqrs');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al crear la PQR');
    } finally {
      setLoading(false);
    }
  };

  const TYPE_INFO = {
    peticion: {
      emoji: '📩',
      desc: 'Solicitud de información, servicio o trámite.',
      color: '#6366f1',
    },
    queja: {
      emoji: '😟',
      desc: 'Expresión de inconformidad por mala atención o servicio.',
      color: '#ec4899',
    },
    reclamo: {
      emoji: '⚠️',
      desc: 'Exigencia de corrección por perjuicio o incumplimiento.',
      color: '#f97316',
    },
  };

  const selected = TYPE_INFO[form.pqr_type];

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/mis-pqrs')}
          >
            <ArrowLeft size={14} /> Volver
          </button>
          <div>
            <h1>Nueva PQR</h1>
            <p>Completa el formulario para registrar tu solicitud</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Type selector */}
              <div className="form-group">
                <label className="form-label">Tipo de PQR *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {Object.entries(TYPE_INFO).map(([type, info]) => (
                    <label
                      key={type}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                        padding: '14px 10px',
                        border: `2px solid ${form.pqr_type === type ? info.color : '#e2e8f0'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: form.pqr_type === type ? `${info.color}10` : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="radio"
                        name="pqr_type"
                        value={type}
                        checked={form.pqr_type === type}
                        onChange={handleChange('pqr_type')}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: 24 }}>{info.emoji}</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: form.pqr_type === type ? info.color : '#475569',
                          textTransform: 'capitalize',
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Breve descripción del asunto"
                  value={form.title}
                  onChange={handleChange('title')}
                  maxLength={200}
                />
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>
                  {form.title.length}/200
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción detallada *</label>
                <textarea
                  className="form-control"
                  placeholder="Describe tu solicitud con el mayor detalle posible..."
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={5}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prioridad</label>
                  <select
                    className="form-control"
                    value={form.priority}
                    onChange={handleChange('priority')}
                  >
                    <option value="baja">🟢 Baja</option>
                    <option value="media">🔵 Media</option>
                    <option value="alta">🟡 Alta</option>
                    <option value="critica">🔴 Crítica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-control"
                    value={form.category}
                    onChange={handleChange('category')}
                  >
                    <option value="">Seleccionar categoría</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/mis-pqrs')}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner" /> : <><Send size={15} /> Enviar PQR</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info sidebar */}
        <div>
          <div
            className="card"
            style={{
              border: `2px solid ${selected.color}30`,
              background: `${selected.color}05`,
            }}
          >
            <div className="card-body">
              <div style={{ fontSize: 40, marginBottom: 12 }}>{selected.emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: selected.color, marginBottom: 8 }}>
                {form.pqr_type.charAt(0).toUpperCase() + form.pqr_type.slice(1)}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                {selected.desc}
              </p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-body">
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#374151' }}>
                💡 Consejos para una buena PQR
              </h4>
              <ul style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Sé claro y específico en tu descripción</li>
                <li>Incluye fechas y datos relevantes</li>
                <li>Adjunta referencias si las tienes</li>
                <li>Elige la prioridad correctamente</li>
              </ul>
            </div>
          </div>

          <div
            className="card"
            style={{ marginTop: 16, background: '#f0fdf4', border: '1px solid #a7f3d0' }}
          >
            <div className="card-body">
              <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6 }}>
                ✅ Tu PQR será registrada y podrás hacer seguimiento desde <strong>Mis PQRs</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
