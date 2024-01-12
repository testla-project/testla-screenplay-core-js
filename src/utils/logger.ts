const blanksPerLevel = 4;

let indentationLevel = 0;

export const indentationLevelUp = (): void => { indentationLevel += 1; };

export const indentationLevelDown = (): void => { indentationLevel -= 1; };

const blankifyMsg = (msg: string, level: number) => {
    let finalMsg = msg;

    for (let i = 0; i <= level * blanksPerLevel; i += 1) {
        finalMsg = ` ${finalMsg}`;
    }

    return finalMsg;
};

const log = (msg: string): void => {
    if (!process.env.DEBUG?.includes('testla:screenplay')) {
        return;
    }

    process.stdout.write(`[TESTLA/SCREENPLAY]${blankifyMsg(msg, indentationLevel)}\n`);
};

export default log;
