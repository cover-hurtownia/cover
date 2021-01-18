export const showPrice = price => `${(price / 100.0).toFixed(2).replace(".", ",")}zł`

export const groupParams = params => Array
    .from(params)
    .reduce((acc, [key, value]) => {
        if (acc.hasOwnProperty(key)) {
            if (Array.isArray(acc[key])) acc[key] = [...acc[key], value];
            else acc[key] = [acc[key], value];
        }
        else acc[key] = value;

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

export const intersperse = (xs, separator) => xs.flatMap(x => [x, separator]).slice(0, -1);