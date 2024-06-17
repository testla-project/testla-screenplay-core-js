import { LogEvent } from '../interfaces';

export const stringifyLogEvent = (event: LogEvent): string => JSON.stringify(event);

export const parseLogEvent = (eventString: string): LogEvent => JSON.parse(eventString);

export const checkIfLogEvent = (eventString: string): boolean => eventString.startsWith('{"activityType":');
