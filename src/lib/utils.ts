//add a 0 if the number is less than 10
export const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);