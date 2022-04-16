import { BoardSpaceProperty } from '@/components/Game/Board/spaces';
import { formatPrice } from '@/util/formatPrice';
import { propertyGroupToCSS } from '@/util/property-colors';
import { render } from '@testing-library/react';
import React from 'react';
import { fakeProperty } from '../fakers';

describe('Property Space', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <BoardSpaceProperty property={fakeProperty()} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const property = fakeProperty();
    const { container } = render(<BoardSpaceProperty property={property} />);
    expect(container.textContent).toContain(property.name);
    expect(container.textContent).toContain(formatPrice(property.price ?? 0));
  });

  it('has the correct property group colour', () => {
    const property = fakeProperty();
    // cos of how jest takes snapshots, the bg is rgb instead of hex so we need to convert it to hex
    const bg = propertyGroupToCSS[property.property_group_color];
    const convertHexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? result.slice(1, 4).map(x => parseInt(x, 16)) : [0, 0, 0];
    };
    const rgb = convertHexToRgb(bg);

    const { container } = render(<BoardSpaceProperty property={property} />);

    expect(
      container.firstElementChild?.attributes.getNamedItem('style')?.value
    ).toContain(`rgb(${rgb.join(', ')})`);
  });
});
