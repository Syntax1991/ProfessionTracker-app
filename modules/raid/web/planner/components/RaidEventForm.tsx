import {
  useState,
  type FormEvent
} from "react";
import type { GuildTeam } from "../../../../guild/web/teams/types/team.types";
import {
  findRaidByKey,
  findRaidByName,
  getRaidsForScheduledAt,
  getRaidSeasonForScheduledAt
} from "../../../shared/catalog/raidCatalog";
import { RaidEventFormFields } from "./RaidEventFormFields";
import type { RaidEventFormState } from "./RaidEventFormFields";
import type {
  RaidEvent,
  RaidEventInput
} from "../types/raidEvent.types";

type RaidEventFormProps = {
  event: RaidEvent | null;
  prefillDate: Date | null;
  teams: GuildTeam[];
  onCancel: () => void;
  onSubmit: (
    input: RaidEventInput
  ) => Promise<void>;
};

function toDateTimeInputValue(
  value: string | undefined
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const offsetMilliseconds =
    date.getTimezoneOffset() *
    60 *
    1000;

  return new Date(
    date.getTime() -
      offsetMilliseconds
  )
    .toISOString()
    .slice(0, 16);
}

function toPrefillDateTimeInputValue(
  date: Date
): string {
  const withDefaultTime =
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      20,
      0
    );

  const offsetMilliseconds =
    withDefaultTime
      .getTimezoneOffset() *
    60 *
    1000;

  return new Date(
    withDefaultTime.getTime() -
      offsetMilliseconds
  )
    .toISOString()
    .slice(0, 16);
}

function createInitialState(
  event: RaidEvent | null,
  prefillDate: Date | null
): RaidEventFormState {
  const scheduledAt = event
    ? toDateTimeInputValue(
        event.scheduledAt
      )
    : prefillDate
      ? toPrefillDateTimeInputValue(
          prefillDate
        )
      : "";

  const catalogRaid = event
    ? findRaidByName(
        event.raidInstance
      )
    : null;

  const availableRaids =
    getRaidsForScheduledAt(
      scheduledAt
    );

  return {
    title: event?.title ?? "",
    raidKey:
      catalogRaid?.key ??
      (
        event
          ? ""
          : availableRaids[0]?.key ??
            ""
      ),
    legacyRaidInstance:
      event && !catalogRaid
        ? event.raidInstance
        : "",
    difficulty:
      event?.difficulty ??
      "HEROIC",
    scheduledAt,
    teamId:
      event?.teamId ?? "",
    notes:
      event?.notes ?? ""
  };
}

export function RaidEventForm({
  event,
  prefillDate,
  teams,
  onCancel,
  onSubmit
}: RaidEventFormProps) {
  const [form, setForm] =
    useState<RaidEventFormState>(
      () =>
        createInitialState(
          event,
          prefillDate
        )
    );

  const [
    isSubmitting,
    setIsSubmitting
  ] = useState(false);

  const availableRaids =
    getRaidsForScheduledAt(
      form.scheduledAt
    );

  const currentRaid =
    findRaidByKey(
      form.raidKey
    );

  const selectableRaids =
    currentRaid &&
    !availableRaids.some(
      (raid) =>
        raid.key ===
        currentRaid.key
    )
      ? [
          currentRaid,
          ...availableRaids
        ]
      : availableRaids;

  const selectedSeason =
    currentRaid
      ? `Midnight Season ${currentRaid.season}`
      : getRaidSeasonForScheduledAt(
          form.scheduledAt
        ).label;

  const handleFieldChange = <
    K extends keyof RaidEventFormState
  >(
    field: K,
    value: RaidEventFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleRaidChange = (
    raidKey: string
  ) => {
    setForm((current) => ({
      ...current,
      raidKey,
      legacyRaidInstance: ""
    }));
  };

  const handleScheduledAtChange = (
    scheduledAt: string
  ) => {
    const nextRaids =
      getRaidsForScheduledAt(
        scheduledAt
      );

    setForm((current) => {
      const currentStillAvailable =
        nextRaids.some(
          (raid) =>
            raid.key ===
            current.raidKey
        );

      return {
        ...current,
        scheduledAt,
        raidKey:
          currentStillAvailable
            ? current.raidKey
            : nextRaids[0]?.key ??
              "",
        legacyRaidInstance: ""
      };
    });
  };

  const handleSubmit = async (
    formEvent:
      FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();

    const selectedRaid =
      findRaidByKey(
        form.raidKey
      );

    const raidInstance =
      selectedRaid?.name ??
      form.legacyRaidInstance;

    if (!raidInstance) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        raidInstance,
        difficulty:
          form.difficulty,
        scheduledAt:
          new Date(
            form.scheduledAt
          ).toISOString(),
        teamId:
          form.teamId || null,
        notes:
          form.notes.trim() ||
          null
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="character-form raid-event-form"
      onSubmit={handleSubmit}
    >
      <RaidEventFormFields
        bossCount={
          currentRaid?.bossCount ??
          null
        }
        form={form}
        isEditing={
          event !== null
        }
        isSubmitting={
          isSubmitting
        }
        onCancel={onCancel}
        onFieldChange={
          handleFieldChange
        }
        onRaidChange={
          handleRaidChange
        }
        onScheduledAtChange={
          handleScheduledAtChange
        }
        raids={selectableRaids}
        selectedSeason={
          selectedSeason
        }
        teams={teams}
      />
    </form>
  );
}