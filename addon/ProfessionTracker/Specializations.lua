local _, PT = ...

function PT.CollectProfessionSpecializations(
    skillLineID
)
    if not skillLineID
        or skillLineID == 0
        or not C_ProfSpecs
        or not C_Traits
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

    local tabIDs =
        C_ProfSpecs.GetSpecTabIDsForSkillLine(
            skillLineID
        )
        or {}

    for _, treeID in ipairs(tabIDs) do
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

    local skillLineID,
        skillLineDisplayName,
        _,
        _,
        _,
        parentSkillLineID,
        parentSkillLineDisplayName =
        C_TradeSkillUI.GetTradeSkillLine()

    return {
        skillLineId =
            childSkillLineID,
        displayedSkillLineId =
            skillLineID,
        displayName =
            skillLineDisplayName,
        parentSkillLineId =
            parentSkillLineID,
        parentProfessionName =
            parentSkillLineDisplayName
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

    specializationData.capturedAt =
        time()

    return specializationData
end

function PT.IsOpenProfessionConfig(
    configID
)
    if not configID then
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