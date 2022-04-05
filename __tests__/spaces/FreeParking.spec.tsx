import BoardSpace from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Free Parking Bord Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpace.FreeParking />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpace.FreeParking />);
    expect(container.textContent).toContain('Free');
    expect(container.textContent).toContain('Parking');
  });
});
