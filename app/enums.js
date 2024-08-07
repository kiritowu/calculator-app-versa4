export const id2Symbol = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    dot: ".",
    plus: "+",
    minus: "-",
    times: "*",
    divide: "/",
};

export const symbol2Id = Object.keys(id2Symbol)
    .reduce((obj, key) => ({ ...obj, [id2Symbol[key]]: key }), {});

export const opsMethods = {
    "plus": (left, right) => left + right,
    "minus": (left, right) => left - right,
    "times": (left, right) => left * right,
    "divide": (left, right) => left / right
}

