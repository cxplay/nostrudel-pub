import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // 引入中文本地化
import { Box, BoxProps } from "@chakra-ui/react";

// 配置 dayjs 使用中文本地化
dayjs.locale("zh-cn");

export default function Timestamp({ timestamp, ...props }: { timestamp: number } & Omit<BoxProps, "children">) {
  const date = dayjs.unix(timestamp);
  const now = dayjs();

  let display = date.format("ll"); // 使用本地化的 "ll" 格式

  if (now.diff(date, "week") <= 6) {
    if (now.diff(date, "d") >= 1) {
      display = Math.round(now.diff(date, "d") * 10) / 10 + `天`;
    } else if (now.diff(date, "h") >= 1) {
      display = Math.round(now.diff(date, "h")) + `小时`;
    } else if (now.diff(date, "m") >= 1) {
      display = Math.round(now.diff(date, "m")) + `分钟`;
    } else if (now.diff(date, "s") >= 1) {
      display = Math.round(now.diff(date, "s")) + `秒`;
    }
  }

  return (
    <Box as="time" dateTime={date.toISOString()} title={date.format("LLL")} {...props}>
      {display}
    </Box>
  );
}
