import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import IsolatedBoundary from '../resilience/IsolatedBoundary';

function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Simulated widget explosion');
  }
  return <div>Healthy Widget Content</div>;
}

describe('IsolatedBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <MemoryRouter>
        <IsolatedBoundary name="TestWidget">
          <BuggyComponent shouldThrow={false} />
        </IsolatedBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText('Healthy Widget Content')).toBeInTheDocument();
  });

  it('catches render errors and renders graceful fallback UI without crashing the app', () => {
    // Suppress console error in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <IsolatedBoundary name="Quote Calculator">
          <BuggyComponent shouldThrow={true} />
        </IsolatedBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText('Quote Calculator is temporarily unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Your saved data and account remain completely safe/i)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
