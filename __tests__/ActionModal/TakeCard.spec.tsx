import ActionModalTakeCard from '@/components/Game/ActionModal/TakeCard';
import { act } from '@testing-library/react';
import React from 'react';
import { fakeCard, fakePlayer, renderWithGameContext } from '../fakers';
jest.useFakeTimers();

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
      const takeCard = jest.fn().mockReturnValue(card);
      const performCardAction = jest.fn();
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="OPPORTUNITY_KNOCKS" />,
        {
          takeCard,
          performCardAction,
          currentPlayer: fakePlayer('cat'),
        }
      );

      const takeCardButton = container.querySelector('button');

      act(() => {
        takeCardButton?.click();
        jest.runAllTimers();
      });
      expect(takeCard).toHaveReturnedWith(card);
      expect(container.textContent).toContain(card.description);

      // Take Card Button now becomes the 'action' button
      act(() => {
        takeCardButton?.click();
        jest.runAllTimers();
      });

      expect(performCardAction).toHaveBeenCalledWith('cat', card);
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
      const performCardAction = jest.fn();
      const takeCard = jest.fn().mockReturnValue(card);
      const { container } = renderWithGameContext(
        <ActionModalTakeCard cardType="POT_LUCK" />,
        {
          takeCard: takeCard,
          performCardAction,
          currentPlayer: fakePlayer('cat'),
        }
      );

      const takeCardButton = container.querySelector('button');

      act(() => {
        takeCardButton?.click();
        jest.runAllTimers();
      });

      expect(container.textContent).toContain(card.description);
      expect(takeCard).toHaveReturnedWith(card);

      // Take Card Button now becomes the 'action' button
      act(() => {
        takeCardButton?.click();
        jest.runAllTimers();
      });

      expect(performCardAction).toHaveBeenCalledWith('cat', card);
    });
  });
});
