import { ActionModalTakeCard } from '@/components/Game/ActionModal/Content';
import { act } from '@testing-library/react';
import React from 'react';
import { fakeCard, fakePlayer, renderWithGameContext } from '../fakers';

describe('Take Card Action Modal', () => {
  describe('Opportunity Knocks', () => {
    it('matches snapshot', () => {
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('shows correct text', () => {
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />
      );
      expect(container.textContent).toContain('Opportunity Knocks');
    });

    it('card can be taken once button clicked and action is performed after next click', () => {
      const card = fakeCard({
        type: 'OPPORTUNITY_KNOCKS',
        action_type: 'PAY_BANK',
        description: 'Pay bank £200',
      });
      const payBank = jest.fn();
      const takeCard = jest.fn().mockReturnValue(card);
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />,
        {
          takeCard,
          payBank,
          currentPlayer: fakePlayer('cat'),
        }
      );

      const takeCardButton = container.querySelector('button');

      act(() => {
        takeCardButton?.click();
        new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(takeCard).toHaveReturnedWith(card);
      expect(container.textContent).toContain(card.description);

      // Take Card Button now becomes the 'action' button
      act(() => {
        takeCardButton?.click();
        new Promise(resolve => setTimeout(resolve));
      });

      expect(payBank).toHaveBeenCalledWith('cat', card.cost);
    });
  });

  describe('Pot Luck', () => {
    it('matches snapshot', () => {
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="POT_LUCK" />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('shows correct text', () => {
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="POT_LUCK" />
      );
      expect(container.textContent).toContain('Pot Luck');
    });

    it('card can be taken once button clicked and action is performed after next click', () => {
      const card = fakeCard({
        type: 'POT_LUCK',
        action_type: 'PAY_BANK',
        description: 'Pay bank £200',
      });
      const payBank = jest.fn();
      const takeCard = jest.fn().mockReturnValue(card);
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="POT_LUCK" />,
        {
          takeCard,
          payBank,
          currentPlayer: fakePlayer('cat'),
        }
      );

      const takeCardButton = container.querySelector('button');

      act(() => {
        takeCardButton?.click();
        new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(takeCard).toHaveReturnedWith(card);
      expect(container.textContent).toContain(card.description);

      // Take Card Button now becomes the 'action' button
      act(() => {
        takeCardButton?.click();
        new Promise(resolve => setTimeout(resolve));
      });

      expect(payBank).toHaveBeenCalledWith('cat', card.cost);
    });
  });
});
