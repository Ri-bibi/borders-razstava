import { useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Data = {
  year: string;
  total: number;
  domestic: number;
  foreign: number;
};

const guestData = [
  { year: "1955", total: 1454442, domestic: 1200609, foreign: 253833 },
  { year: "1956", total: 1293917, domestic: 1110204, foreign: 183709 },
  { year: "1957", total: 1752864, domestic: 1376579, foreign: 376285 },
  { year: "1958", total: 2065790, domestic: 1727829, foreign: 337961 },
  { year: "1959", total: 2494254, domestic: 2046881, foreign: 447373 },
  { year: "1960", total: 2293131, domestic: 1804896, foreign: 488235 },
  { year: "1961", total: 2690494, domestic: 1939322, foreign: 751172 },
  { year: "1962", total: 2769656, domestic: 2060544, foreign: 709112 },
];

export const Graf = () => {
  const [data, setData] = useState<Data[]>([]);
  const { ref, inView } = useInView({ triggerOnce: true });

  // Delay setting the data briefly when in view
  if (inView && data.length === 0) {
    setTimeout(() => setData(guestData), 300);
  }
  return (
    <div className="w-full h-full" ref={ref}>
      <ResponsiveContainer>
        <LineChart
          title="PRENOČITVE: 1955–1962"
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid color="#e4d0c5" opacity={0.5} /> */}
          <XAxis dataKey="year" />
          <Tooltip />
          <Legend />
          <Line
            animationDuration={400}
            type="linear"
            dataKey="total"
            stroke="#e4d0c5"
            strokeWidth={5}
          />
          <Line
            animationDuration={200}
            type="linear"
            dataKey="domestic"
            stroke="#005670"
            strokeWidth={5}
          />
          <Line
            animationDuration={600}
            type="linear"
            dataKey="foreign"
            stroke="#b09180"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
      <h3 className="text-brand-beige-dark font-bold font-plex   text-xl lg:text-2xl ">
        PRENOČITVE: 1955–1962
      </h3>
    </div>
  );
};
