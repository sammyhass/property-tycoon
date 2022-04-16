import { BoardSpaceTakeCard } from '@/components/Game/Board/spaces';
import { render } from '@testing-library/react';
import React from 'react';

describe('Take Card Board Space', () => {
  describe('Opportunity Knocks', () => {
    it('matches snapshot', () => {
      const { container } = render(
        <BoardSpaceTakeCard cardType="OPPORTUNITY_KNOCKS" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
    it('shows correct text', () => {
      const { container } = render(
        <BoardSpaceTakeCard cardType="OPPORTUNITY_KNOCKS" />
      );
      expect(container.textContent).toContain('Opportunity Knocks');
    });
  });

  describe('Pot Luck', () => {
    it('matches snapshot', () => {
      const { container } = render(<BoardSpaceTakeCard cardType="POT_LUCK" />);
      expect(container.firstChild).toMatchSnapshot();
    });
    it('shows correct text', () => {
      const { container } = render(<BoardSpaceTakeCard cardType="POT_LUCK" />);
      expect(container.textContent).toContain('Pot Luck');
    });
  });
});
