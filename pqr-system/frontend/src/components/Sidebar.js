import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, RoleBadge } from './Badges';
import {
  LayoutDashboard, FilePlus, ClipboardList, LogOut,
  Settings, ShieldCheck, Users, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = {
  user: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
    { to: '/crear-pqr', icon: FilePlus, label: 'Nueva PQR' },
    { to: '/mis-pqrs', icon: ClipboardList, label: 'Mis PQRs' },
  ],
  supervisor: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
    { to: '/pqrs-asignadas', icon: ShieldCheck, label: 'PQRs Asignadas' },
  ],
  operator: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
    { to: '/todas-pqrs', icon: ClipboardList, label: 'Todas las PQRs' },
    { to: '/usuarios', icon: Users, label: 'Usuarios' },
  ],
};

const ROLE_GRADIENT = {
  user: 'linear-gradient(135deg, #6366f1, #818cf8)',
  supervisor: 'linear-gradient(135deg, #ec4899, #f472b6)',
  operator: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
};

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV_ITEMS[user?.role] || [];

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: ROLE_GRADIENT[user?.role] }}>
          PQ
        </div>
        <h2>Sistema PQR</h2>
        <span>Gestión de solicitudes</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Menú</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon />
            <span style={{ flex: 1 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <Avatar name={user?.full_name} role={user?.role} size={36} />
          <div className="user-info">
            <div className="name">{user?.full_name}</div>
            <RoleBadge role={user?.role} />
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
