import { BoardSpaceTax } from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Tax Board Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpaceTax taxCost={100} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpaceTax taxCost={100} />);

    expect(container.textContent).toContain('£100 Tax');
  });
});
