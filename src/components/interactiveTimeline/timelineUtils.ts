export const generateRange = (from: number, to: number) => {
  const out = [];
  for (let i = from; i < to; i++) {
    out.push(i);
  }
  return out;
};
