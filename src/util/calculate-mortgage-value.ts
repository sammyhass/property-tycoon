interface MortgageResponseT {
  value: number;
  type: 'mortgage' | 'unmortgage' | 'sell_house' | 'sell_hotel';
}

// Mortgage value is half of the property value or if the property has a house on it, the house/hotel must be sold and its value is half its price.
export const calculateMortgageValue = (
  price: number,
  nHouses?: number,
  hotelCost?: number,
  houseCost?: number
): MortgageResponseT => {
  const mortgageValue = price / 2;

  if (!houseCost || !hotelCost || nHouses === 0) {
    return {
      value: mortgageValue,
      type: 'mortgage',
    };
  }

  if (nHouses === 5) {
    return {
      value: hotelCost / 2,
      type: 'sell_hotel',
    };
  }

  return {
    value: houseCost / 2,
    type: 'sell_house',
  };
};
