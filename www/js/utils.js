import * as constants from "/js/constants.js";

export const showPrice = price => `${(price).toFixed(2).replace(".", ",")}zł`
export const showTag = tag => (constants.tags)?.[tag] ?? "???";
export const showFormat = format => (constants.formats)?.[format] ?? "???";
export const showDelivery = delivery => (constants.delivery)?.[delivery] ?? "???";
export const showStatus = status => (constants.status)?.[status] ?? "???";

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