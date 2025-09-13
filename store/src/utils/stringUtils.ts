/**
 * Normalize a string:
 * - Remove Vietnamese accents (dấu)
 * - Replace đ/Đ with d/D
 * - Convert to lowercase
 * - Remove all spaces
 */
export const normalizeLocation = (str: string): string => {
    return str
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .normalize('NFD') // decompose combined letters
        .replace(/[\u0300-\u036f]/g, '') // remove remaining accents
        .toLowerCase()
        .replace(/\s+/g, ''); // remove spaces
};
