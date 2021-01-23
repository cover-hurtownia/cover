import * as constants from "/js/constants.js";

export const showPrice = price => `${(price).toFixed(2).replace(".", ",")}zł`
export const showTag = tag => (constants.tags)?.[tag] ?? "???";
export const showFormat = format => (constants.formats)?.[format] ?? "???";
export const showDelivery = delivery => (constants.delivery)?.[delivery] ?? "???";
export const showStatus = status => (constants.status)?.[status] ?? "???";
export const showDate = date => new Date(date).toISOString().split('T')[0];
export const showDateTime = datetime => {
    const [date, time] = new Date(datetime).toISOString().split('T');
    return `${date}, ${time.substring(0, 8)}`;
};

export const getStatusClassName = status => {
    if (status === "placed") return `is-danger`;
    if (status === "accepted") return `is-warning`;
    if (status === "delivered") return `is-success`;
    if (status === "sent") return `is-info`;
    if (status === "cancelled") return `is-dark`;
};

export const groupParams = params => Array
    .from(params)
    .reduce((acc, [key, value]) => {
        if (acc.hasOwnProperty(key)) acc[key] = [...acc[key], value];
        else acc[key] = [value];

        return acc;
    }, {});

export const ungroupParams = params => new URLSearchParams(Object
    .entries(params)
    .reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            for (const v of value) {
                if (v !== null && v !== "") acc.push([key, v]);
            }
        }
        else if (value !== null && value !== "") acc.push([key, value]);

        return acc;
    }, []));

export const capitalizeFirst = text => text[0].toUpperCase() + text.substring(1);
export const intersperse = (xs, separator) => xs.flatMap(x => [x, separator]).slice(0, -1);