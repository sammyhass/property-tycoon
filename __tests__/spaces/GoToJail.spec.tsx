import BoardSpace from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Go to Jail Board Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpace.GoToJail />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpace.GoToJail />);
    expect(container.textContent).toContain('Jail');
    expect(container.textContent).toContain('Go to');
  });
});
