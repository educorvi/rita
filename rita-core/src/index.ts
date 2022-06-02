export * from './Tools';
export * from './logicElements';
export * from './Logger';
export * from './Errors';
import Parser from './Parser';
//version number is replaced in build process. Do not change these two lines!
process.env.VERSION = '0.0.0';
const version = process.env.VERSION;

export { Parser, version };
