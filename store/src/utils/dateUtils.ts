/**
 * Format a Date or ISO string to 'DD/MM/YYYY'
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '';

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // months 0-indexed
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};
