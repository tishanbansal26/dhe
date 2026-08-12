import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import * as AuthContext from '../../lib/AuthContext';

// Mock useAuth
vi.mock('../../lib/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;
  const HomePage = () => <div>Home Page</div>;

  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('redirects to /login if user is not authenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, userProfile: null });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children if user is authenticated and no roles are specified', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: '1' }, userProfile: { role: 'customer' } });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading spinner if allowedRoles are specified but userProfile is not yet loaded', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: '1' }, userProfile: null });

    const { container } = renderWithRouter(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to / if user does not have the required role', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: '1' }, userProfile: { role: 'customer' } });

    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin', 'agent']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children if user has the required role', () => {
    AuthContext.useAuth.mockReturnValue({ user: { id: '1' }, userProfile: { role: 'admin' } });

    renderWithRouter(
      <ProtectedRoute allowedRoles={['admin', 'agent']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
