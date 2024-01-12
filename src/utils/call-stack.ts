export const identifyCaller = (): string => {
    const callerLine = new Error().stack?.split('\n')[4].trim();
    const callerName = callerLine?.match(/at Function.(.+) \(/);
    return callerName ? callerName[1] : 'unknown';
};
