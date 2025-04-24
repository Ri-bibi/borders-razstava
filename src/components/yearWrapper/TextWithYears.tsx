import { extractYears } from "../../utils/yearsHighlite";
import { Year } from "./yearWrapper";

export default function TextWithYears({ body }: { body: string }) {
  return extractYears(body, Year);
}
