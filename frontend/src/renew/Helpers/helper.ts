
export function getBorderColor(value: number, min: number) {
    return value < min && value === 0 ? '#ff000069' : '#65d18e';
}