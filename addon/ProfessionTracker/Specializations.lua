local _, PT = ...

local function getProfessionInfo(
    skillLineID
)
    if not C_TradeSkillUI then
        return nil
    end

    if C_TradeSkillUI.GetProfessionInfoBySkillLineID then
        local info =
            C_TradeSkillUI.GetProfessionInfoBySkillLineID(
                skillLineID
            )

        if info then
            return info
        end
    end

    if C_TradeSkillUI.GetChildProfessionInfo then
        local currentSkillLineID =
            nil

        if C_TradeSkillUI.GetProfessionChildSkillLineID then
            currentSkillLineID =
                C_TradeSkillUI.GetProfessionChildSkillLineID()
        end

        if currentSkillLineID
            == skillLineID
        then
            return C_TradeSkillUI.GetChildProfessionInfo()
        end
    end

    return nil
end

local function getParentSkillLineID(
    professionInfo
)
    if not professionInfo then
        return nil
    end

    return professionInfo.parentProfessionID
        or professionInfo.professionID
end

local function getParentProfessionName(
    professionInfo
)
    if not professionInfo then
        return nil
    end

    return professionInfo.parentProfessionName
        or professionInfo.professionName
end

function PT.CollectProfessionSpecializations(
    skillLineID
)
    if not skillLineID
        or skillLineID == 0
        or not C_ProfSpecs
        or not C_Traits
        or not C_ProfSpecs.SkillLineHasSpecialization
    then
        return nil
    end

    local hasSpecialization =
        C_ProfSpecs.SkillLineHasSpecialization(
            skillLineID
        )

    local result = {
        skillLineId =
            skillLineID,
        hasSpecialization =
            hasSpecialization
            == true,
        tabs = {}
    }

    if not hasSpecialization then
        return result
    end

    if not C_ProfSpecs.GetConfigIDForSkillLine then
        result.available = false
        return result
    end

    local configID =
        C_ProfSpecs.GetConfigIDForSkillLine(
            skillLineID
        )

    if not configID
        or configID == 0
    then
        result.available = false
        return result
    end

    result.available = true
    result.configId =
        configID

    if C_ProfSpecs.GetCurrencyInfoForSkillLine then
        local currencyInfo =
            C_ProfSpecs.GetCurrencyInfoForSkillLine(
                skillLineID
            )

        if currencyInfo then
            result.knowledge = {
                available =
                    currencyInfo.numAvailable
                    or 0,
                name =
                    currencyInfo.currencyName
            }
        end
    end

    if not C_ProfSpecs.GetSpecTabIDsForSkillLine then
        return result
    end

    local tabIDs =
        C_ProfSpecs.GetSpecTabIDsForSkillLine(
            skillLineID
        )
        or {}

    for _, treeID in ipairs(
        tabIDs
    ) do
        local tab =
            PT.CollectProfessionTraitTab(
                configID,
                treeID
            )

        if tab then
            table.insert(
                result.tabs,
                tab
            )
        end
    end

    return result
end

function PT.GetOpenProfessionContext()
    if not C_TradeSkillUI
        or not C_TradeSkillUI.GetProfessionChildSkillLineID
    then
        return nil
    end

    local childSkillLineID =
        C_TradeSkillUI.GetProfessionChildSkillLineID()

    if not childSkillLineID
        or childSkillLineID == 0
    then
        return nil
    end

    local professionInfo =
        getProfessionInfo(
            childSkillLineID
        )

    return {
        skillLineId =
            childSkillLineID,
        displayedSkillLineId =
            childSkillLineID,
        displayName =
            professionInfo
            and professionInfo.professionName
            or nil,
        expansionName =
            professionInfo
            and professionInfo.expansionName
            or nil,
        parentSkillLineId =
            getParentSkillLineID(
                professionInfo
            ),
        parentProfessionName =
            getParentProfessionName(
                professionInfo
            )
    }
end

function PT.CollectOpenProfessionSpecializations()
    local context =
        PT.GetOpenProfessionContext()

    if not context then
        return nil
    end

    local specializationData =
        PT.CollectProfessionSpecializations(
            context.skillLineId
        )

    if not specializationData then
        return nil
    end

    specializationData.parentSkillLineId =
        context.parentSkillLineId

    specializationData.parentProfessionName =
        context.parentProfessionName

    specializationData.displayName =
        context.displayName

    specializationData.expansionName =
        context.expansionName

    specializationData.capturedAt =
        time()

    return specializationData
end

function PT.IsOpenProfessionConfig(
    configID
)
    if not configID
        or not C_ProfSpecs
        or not C_ProfSpecs.GetConfigIDForSkillLine
    then
        return false
    end

    local context =
        PT.GetOpenProfessionContext()

    if not context then
        return false
    end

    local professionConfigID =
        C_ProfSpecs.GetConfigIDForSkillLine(
            context.skillLineId
        )

    return professionConfigID
        == configID
end