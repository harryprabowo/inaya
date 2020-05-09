import { isNullOrUndefined } from "util"

const throwIfMissing = () => {
    throw new Error(
        "Required properties are either null or undefined"
    );
};

const throwIfNotType = (val, type) => {
    if (isNullOrUndefined(val)) return val

    if (typeof val === type) return val
    throw new Error(`Property type mismatch - ${val} is not of type ${type}`)
}

const throwIfNotInstance = (val, inst) => {
    if (isNullOrUndefined(val)) return val

    if (val instanceof inst) return val

    throw new Error(`Property not of correct class - got  ${val.constructor || typeof val} instead`)
}

const argsValidator = {
    throwIfMissing,
    throwIfNotType,
    throwIfNotInstance
}

export default argsValidator