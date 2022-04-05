import BoardSpace from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Just Visiting/Jail Board Space', () => {
  it('matches snapshot', () => {
    const { container } = render(<BoardSpace.Jail />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { container } = render(<BoardSpace.Jail />);
    expect(container.textContent).toContain('Just');
    expect(container.textContent).toContain('Visiting');
  });
});
