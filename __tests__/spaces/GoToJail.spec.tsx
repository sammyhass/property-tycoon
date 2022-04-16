import { BoardSpaceGoToJail } from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Go to Jail Board Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpaceGoToJail />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpaceGoToJail />);
    expect(container.textContent).toContain('Jail');
    expect(container.textContent).toContain('Go to');
  });
});
