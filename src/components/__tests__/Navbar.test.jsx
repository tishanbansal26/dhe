import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import * as AuthContext from '../../lib/AuthContext';

// Mock AuthContext
vi.mock('../../lib/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock NotificationBell since it might have its own complex logic
vi.mock('../NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}));

describe('Navbar', () => {
  const renderNavbar = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
      </MemoryRouter>
    );
  };

  it('renders the logo correctly', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, userProfile: null, agentProfile: null });
    renderNavbar();
    expect(screen.getByText(/Radhe/i)).toBeInTheDocument();
    expect(screen.getByText(/Invest/i)).toBeInTheDocument();
  });

  it('shows login buttons when unauthenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, userProfile: null, agentProfile: null });
    renderNavbar();
    
    // The button says "Agent Login" in the desktop and mobile versions
    const loginLinks = screen.getAllByRole('link', { name: /Login/i });
    expect(loginLinks.length).toBeGreaterThan(0);
  });

  it('shows My Dashboard link for customers', () => {
    AuthContext.useAuth.mockReturnValue({ 
      user: { id: '1' }, 
      userProfile: { role: 'customer' }, 
      agentProfile: null 
    });
    renderNavbar();
    
    const dashboardLinks = screen.getAllByRole('link', { name: /My Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });

  it('shows Admin Portal link for admins', () => {
    AuthContext.useAuth.mockReturnValue({ 
      user: { id: '1' }, 
      userProfile: null, 
      agentProfile: { role: 'admin' } 
    });
    renderNavbar();
    
    const adminLinks = screen.getAllByRole('link', { name: /Admin Portal/i });
    expect(adminLinks.length).toBeGreaterThan(0);
  });

  it('shows Notification Bell when authenticated', () => {
    AuthContext.useAuth.mockReturnValue({ 
      user: { id: '1' }, 
      userProfile: { role: 'customer' }, 
      agentProfile: null 
    });
    renderNavbar();
    
    expect(screen.getAllByTestId('notification-bell').length).toBeGreaterThan(0);
  });

  it('does not show Notification Bell when unauthenticated', () => {
    AuthContext.useAuth.mockReturnValue({ user: null, userProfile: null, agentProfile: null });
    renderNavbar();
    
    expect(screen.queryByTestId('notification-bell')).not.toBeInTheDocument();
  });
});
