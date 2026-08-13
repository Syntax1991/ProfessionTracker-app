local _, GT = ...

function GT.RequestRosterUpdate()
    if C_GuildInfo
        and C_GuildInfo.GuildRoster
    then
        C_GuildInfo.GuildRoster()
        return
    end

    if GuildRoster then
        GuildRoster()
    end
end

function GT.CaptureGuildIdentity()
    local guildName =
        GetGuildInfo
        and GetGuildInfo("player")

    return {
        guildName =
            guildName
            or "Unknown",

        realm = GT.GetRealm(),
        region = GT.GetRegion()
    }
end

local function normalizeNote(note)
    if note and note ~= "" then
        return note
    end

    return nil
end

local function normalizeMemberName(
    name
)
    return string.match(
        name,
        "^[^-]+"
    )
        or name
end

function GT.CaptureRoster(reason)
    if not GT.IsAddonReady() then
        return nil
    end

    local database =
        GT.EnsureDatabase()

    local identity =
        GT.CaptureGuildIdentity()

    database.guildName =
        identity.guildName

    database.realm =
        identity.realm

    database.region =
        identity.region

    local members = {}

    local memberCount =
        GetNumGuildMembers
        and GetNumGuildMembers()
        or 0

    for index = 1, memberCount do
        local name,
            rank,
            rankIndex,
            level,
            class,
            _,
            note,
            officerNote =
            GetGuildRosterInfo(
                index
            )

        if name then
            table.insert(
                members,
                {
                    name =
                        normalizeMemberName(
                            name
                        ),
                    className =
                        class
                        or "Unknown",
                    level =
                        level
                        or 0,
                    rank =
                        rank
                        or "Unknown",
                    rankIndex =
                        rankIndex
                        or 0,
                    note =
                        normalizeNote(
                            note
                        ),
                    officerNote =
                        normalizeNote(
                            officerNote
                        )
                }
            )
        end
    end

    database.members = members

    database.capturedAt =
        GT.Now()

    database.snapshotReason =
        reason
        or "roster-update"

    return database
end
