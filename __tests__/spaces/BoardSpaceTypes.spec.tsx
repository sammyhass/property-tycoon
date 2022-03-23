import BoardSpace from '@/components/Game/Board/spaces';
import { formatPrice } from '@/util/formatPrice';
import { render } from '@testing-library/react';
import React from 'react';
import { fakeBoardSpace, fakeProperty } from '../fakers';

// This suite ensures that the correct type of BoardSpace is rendered based on the props passed to it.
describe('BoardSpace Types', () => {
  it('can render GO space', () => {
    const space = fakeBoardSpace({ space_type: 'GO' });
    const { container } = render(<BoardSpace property={null} {...space} />);
    expect(container.textContent).toContain('GO');
  });

  it('can render PROPERTY space', () => {
    const space = fakeBoardSpace({ space_type: 'PROPERTY' });
    const property = fakeProperty();

    const { container } = render(<BoardSpace property={property} {...space} />);

    expect(container.textContent).toContain(property.name);
    expect(container.textContent).toContain(formatPrice(property.price ?? 0));
  });

  it('can render TAX space', () => {
    const space = fakeBoardSpace({ space_type: 'TAX', tax_cost: 100 });
    const { container } = render(<BoardSpace property={null} {...space} />);

    expect(container.textContent).toContain('£100 Tax');
  });

  it('can render GO_TO_JAIL space', () => {
    const space = fakeBoardSpace({ space_type: 'GO_TO_JAIL' });
    const { container } = render(<BoardSpace property={null} {...space} />);

    expect(container.textContent).toContain('Go');
    expect(container.textContent).toContain('to');
    expect(container.textContent).toContain('Jail');
  });

  it('can render JUST_VISITING space', () => {
    const space = fakeBoardSpace({ space_type: 'JUST_VISIT' });
    const { container } = render(<BoardSpace property={null} {...space} />);

    expect(container.textContent).toContain('Just');
    expect(container.textContent).toContain('Visiting');

    expect(container.textContent).toContain('Jail');
  });

  it('can render FREE_PARKING space', () => {
    const space = fakeBoardSpace({ space_type: 'FREE_PARKING' });
    const { container } = render(<BoardSpace property={null} {...space} />);

    expect(container.textContent).toContain('Free');
    expect(container.textContent).toContain('Parking');
  });

  it('can render TAKE_CARD space', () => {
    const space = fakeBoardSpace({
      space_type: 'TAKE_CARD',
      take_card: 'POT_LUCK',
    });
    const { container } = render(<BoardSpace property={null} {...space} />);

    expect(container.textContent).toContain('Pot Luck');
  });
});
