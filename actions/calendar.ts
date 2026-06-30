"use server";

import { getCalendarData } from "@/services/calendar";
import type { CalendarMonthData } from "@/services/calendar";
import { revalidatePath } from "next/cache";

export async function fetchCalendarData(
  year: number,
  month: number
): Promise<CalendarMonthData> {
  return getCalendarData(year, month);
}

export async function revalidateCalendar() {
  revalidatePath("/calendar");
}
