import type { IRangeTimeline } from "./content/other";

export const RangeComponent = ({
  range,
  onClick,
}: {
  range: IRangeTimeline;
  onClick: (year: number) => void;
}) => {
  const yearRange = range.yearTo - range.yearFrom;
  return (
    <div
      className={
        "absolute bg-white/20 h-12 left-0  ml-16 cursor-pointer flex justify-center items-center  text-brand-beige-light font-plex font-medium z-30 hover:bg-white/5 hover:text-white hover:border transition duration-100"
      }
      style={{
        width: `calc(var(--spacing) * ${yearRange * 32.8})`,
        marginTop: ((range.yearFrom % 7) - 3) * 20,
      }}
      onClick={() => {
        onClick(range.yearFrom);
      }}
    >
      {range.yearFrom} - {range.yearTo}
    </div>
  );
};
