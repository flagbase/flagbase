export const isValidVariationSum = (
    variations: {
        variationKey: string
        weight: number
    }[]
) => {
    const sum = variations?.reduce((acc, variation) => variation.weight + acc, 0);
    const isValidSum = sum === 100;
    return isValidSum;
}

export const objectsEqual = (a: object, b: object): boolean => JSON.stringify(a) === JSON.stringify(b)
