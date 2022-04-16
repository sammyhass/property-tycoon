import { BoardSpaceFreeParking } from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Free Parking Bord Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpaceFreeParking />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpaceFreeParking />);
    expect(container.textContent).toContain('Free');
    expect(container.textContent).toContain('Parking');
  });
});
