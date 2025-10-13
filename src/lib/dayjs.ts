import dayjs_ from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs_.extend(utc);
dayjs_.extend(tz);

export const dayjs = dayjs_;
