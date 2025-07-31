export type Option = {
    value: string | number;
    label: string;
};

export function toOptions<T>(
    arr: T[] | undefined,
    idKey: keyof T,
    nameKey: keyof T
): Option[] {
    if (!arr) return [];
    return arr
        .filter(item => !!item[idKey] && !!item[nameKey])
        .map(item => ({
            value: item[idKey] as string | number,
            label: item[nameKey] as string,
        }));
}