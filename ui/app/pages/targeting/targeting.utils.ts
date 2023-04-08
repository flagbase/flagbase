export const isValidVariationSum = (
  variations: {
    variationKey: string;
    weight: number;
  }[],
) => {
  const sum = variations?.reduce((acc, variation) => variation.weight + acc, 0);
  const isValidSum = sum === 100;

  return isValidSum;
};

export const objectsEqual = (a: any, b: any): boolean => {
  // Get the object keys
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  // If the number of keys doesn't match, the objects are not equal
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  // Check each key-value pair recursively
  for (const key of aKeys) {
    const aValue = a[key];
    const bValue = b[key];

    // If the value is an object, call the function recursively
    if (typeof aValue === 'object' && typeof bValue === 'object') {
      if (!objectsEqual(aValue, bValue)) {
        return false;
      }
    } else if (aValue !== bValue) {
      // If the value is not an object and the values are not equal, the objects are not equal
      return false;
    }
  }

  // If all key-value pairs match, the objects are equal
  return true;
};
