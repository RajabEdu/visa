import { Logger } from 'winston';
import { TransformableInfo } from 'logform';
export default function buildDefaultLogger(): Logger;
export declare function buildLogMessagePartsFromInfo(logInfo: TransformableInfo): String[];
export declare function buildVerboseLogMessagePartsFromInfo(logInfo: TransformableInfo): String[];
