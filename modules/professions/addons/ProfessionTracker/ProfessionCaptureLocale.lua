local _, PT = ...

local english = {
    TITLE_MISSING =
        "SynTrack · Profession data missing",

    TITLE_REFRESH =
        "SynTrack · Refresh profession data",

    BODY_MISSING =
        "Open these professions once so SynTrack can capture the current crafting data: %s",

    BODY_OUTDATED =
        "Open these professions once. Their crafting data is older than %d days: %s",

    BODY_MIXED =
        "Open these professions once:\nMissing data: %s\nOlder than %d days: %s",

    FOOTER =
        "SynTrack captures the data automatically when you open the profession."
}

local german = {
    TITLE_MISSING =
        "SynTrack · Profession-Daten fehlen",

    TITLE_REFRESH =
        "SynTrack · Profession-Daten aktualisieren",

    BODY_MISSING =
        "Öffne diese Berufe einmal, damit SynTrack die aktuellen Crafting-Daten erfassen kann: %s",

    BODY_OUTDATED =
        "Öffne diese Berufe einmal. Ihre Crafting-Daten sind älter als %d Tage: %s",

    BODY_MIXED =
        "Öffne diese Berufe einmal:\nFehlende Daten: %s\nÄlter als %d Tage: %s",

    FOOTER =
        "SynTrack erfasst die Daten automatisch, sobald du den Beruf öffnest."
}

local active =
    english

if GetLocale
    and GetLocale() == "deDE"
then
    active =
        german
end

function PT.GetProfessionCaptureLocaleText(
    key
)
    return active[
        key
    ]
        or english[
            key
        ]
        or key
end