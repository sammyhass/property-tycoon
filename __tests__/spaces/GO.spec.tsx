import BoardSpace from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('GO Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpace.Go />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpace.Go />);
    expect(container.textContent).toContain('GO');
    expect(container.textContent).toContain('Collect £200');
  });
});
