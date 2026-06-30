import { getAuthUserId } from "@/actions/auth";
import { getCalendarData } from "@/services/calendar";
import { getCategories } from "@/services/categories";
import { CalendarClient } from "./calendar-client";

export const metadata = {
  title: "Calendar | JityGeld",
  description: "Monthly overview of your financial activity",
};

export default async function CalendarPage() {
  const userId = await getAuthUserId();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [initialData, categories] = await Promise.all([
    getCalendarData(year, month),
    getCategories(userId),
  ]);

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monthly overview of your financial activity
        </p>
      </div>

      <CalendarClient
        initialData={initialData}
        initialYear={year}
        initialMonth={month}
        categories={serializedCategories}
      />
    </div>
  );
}
