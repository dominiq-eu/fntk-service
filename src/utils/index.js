export const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const random = (list = []) => {
  if (list.length > 0) {
    const index = randomBetween(0, list.length - 1);
    return list[index];
  } else {
    return randomBetween(0, 100);
  }
};
