local _, private = ...
local API = private.API

local subscriptions = {}
local nextSubscriptionId = 0

function API.Subscribe(
    topic,
    callback
)
    if type(topic) ~= "string"
        or type(callback) ~= "function"
    then
        return nil,
            "topic and callback are required"
    end

    nextSubscriptionId =
        nextSubscriptionId + 1

    subscriptions[topic] =
        subscriptions[topic]
        or {}

    subscriptions[topic][
        nextSubscriptionId
    ] = callback

    return {
        topic = topic,
        id = nextSubscriptionId
    }
end

function API.Unsubscribe(subscription)
    if type(subscription) ~= "table" then
        return false
    end

    local topicSubscriptions =
        subscriptions[
            subscription.topic
        ]

    if not topicSubscriptions
        or not topicSubscriptions[
            subscription.id
        ]
    then
        return false
    end

    topicSubscriptions[
        subscription.id
    ] = nil

    return true
end

function API.Publish(
    topic,
    payload
)
    local topicSubscriptions =
        subscriptions[topic]

    if not topicSubscriptions then
        return 0
    end

    local delivered = 0

    for _, callback in pairs(
        topicSubscriptions
    ) do
        local succeeded,
            errorMessage =
            pcall(
                callback,
                payload,
                topic
            )

        if succeeded then
            delivered = delivered + 1
        else
            API.Print(
                string.format(
                    "Event %s failed: %s",
                    topic,
                    tostring(errorMessage)
                )
            )
        end
    end

    return delivered
end
