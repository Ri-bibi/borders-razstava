export function YearText({ year }: { year: string }) {
  return (
    <span
      onClick={() => console.log(`Clicked ${year}`)}
      className="underline text-brand-beige-dark font-bold"
    >
      {year}
    </span>
  );
}
