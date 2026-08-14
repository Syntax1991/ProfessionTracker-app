import {
  getMonthGridDays,
  isSameDay,
  isSameMonth,
  weekdayLabels
} from "../utils/calendarMonth";
import type { RaidEvent } from "../types/raidEvent.types";

type RaidCalendarViewProps = {
  monthDate: Date;
  events: RaidEvent[];
  onCreateOnDate: (
    date: Date
  ) => void;
  onSelectEvent: (
    event: RaidEvent
  ) => void;
};

function formatEventTime(
  value: string
): string {
  return new Date(
    value
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function RaidCalendarView({
  monthDate,
  events,
  onCreateOnDate,
  onSelectEvent
}: RaidCalendarViewProps) {
  const days =
    getMonthGridDays(monthDate);

  const today = new Date();

  return (
    <div className="raid-calendar">
      <div className="raid-calendar-weekdays">
        {weekdayLabels.map(
          (label) => (
            <span key={label}>
              {label}
            </span>
          )
        )}
      </div>

      <div className="raid-calendar-grid">
        {days.map((day) => {
          const dayEvents =
            events.filter(
              (event) =>
                isSameDay(
                  new Date(
                    event.scheduledAt
                  ),
                  day
                )
            );

          return (
            <div
              className={[
                "raid-calendar-day",
                isSameMonth(
                  day,
                  monthDate
                )
                  ? ""
                  : "outside-month",
                isSameDay(
                  day,
                  today
                )
                  ? "today"
                  : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={day.toISOString()}
            >
              <button
                className="raid-calendar-day-number"
                onClick={() =>
                  onCreateOnDate(
                    day
                  )
                }
                title="Schedule a raid on this day"
                type="button"
              >
                {day.getDate()}
              </button>

              <div className="raid-calendar-day-events">
                {dayEvents.map(
                  (event) => (
                    <button
                      className={`raid-calendar-event difficulty-${event.difficulty.toLowerCase()}`}
                      key={
                        event.id
                      }
                      onClick={() =>
                        onSelectEvent(
                          event
                        )
                      }
                      type="button"
                    >
                      <span className="raid-calendar-event-time">
                        {formatEventTime(
                          event.scheduledAt
                        )}
                        {" · "}
                        {
                          event.difficulty
                        }
                      </span>

                      <span className="raid-calendar-event-title">
                        {
                          event.raidInstance
                        }
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
