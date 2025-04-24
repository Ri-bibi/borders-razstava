export function Year({ year }: { year: string }) {
  return (
    <span
      onClick={() => console.log(`Clicked ${year}`)}
      className="underline cursor-pointer text-brand-beige-dark font-bold"
    >
      {year}
    </span>
  );
}
