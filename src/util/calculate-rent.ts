import { GameProperty } from '@prisma/client';

export const calculatePropertyRent = <
  T extends Pick<
    GameProperty,
    | 'rent_one_house'
    | 'rent_two_house'
    | 'rent_three_house'
    | 'rent_four_house'
    | 'rent_hotel'
    | 'rent_unimproved'
  >
>(
  property: T,
  houses: number, // max houses is 5, which is equivalent to a hotel
  ownsWholeSet: boolean = false
): number => {
  switch (houses) {
    case 0:
      return (property.rent_unimproved ?? 0) * (ownsWholeSet ? 2 : 1);
    case 1:
      return property.rent_one_house ?? 0;
    case 2:
      return property.rent_two_house ?? 0;
    case 3:
      return property.rent_three_house ?? 0;
    case 4:
      return property.rent_four_house ?? 0;
    case 5:
      return property.rent_hotel ?? 0;
    default:
      throw new Error(`Invalid number of houses: ${houses}`);
  }
};

export const calculateStationRent = (nOwned: number) =>
  25 * Math.pow(2, nOwned - 1);

export const calculateUtilityMulitplier = (nOwned: number) =>
  nOwned === 1 ? 4 : 10;

export const calculateUtilityRent = (nOwned: number, roll: number) =>
  calculateUtilityMulitplier(nOwned) * roll;
