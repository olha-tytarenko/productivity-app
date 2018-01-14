import { getStringMonth, getMonthFromString, getShortMonthName } from './date-formatting';

describe('Date formatting', () => {
  it('getStringMonth should return month name by minth number', () => {
    expect(getStringMonth(1)).toEqual('February');
  });

  it('getMonthFromString should return month number by name', () => {
    expect(getMonthFromString('March')).toEqual(3);
  });

  it('getMonthFromString should return -1 if name is invalid', () => {
    expect(getMonthFromString('advadsvsdv')).toEqual(-1);
  });

  it('getShortMonthName should return short form of month namr', () => {
    expect(getShortMonthName('OcToBer')).toEqual('Oct');
  });
});