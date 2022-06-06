export * from './Tools';
export * from './logicElements';
export * from './Logger';
export * from './Errors';
import Parser from './Parser';

const version = process.env.VERSION;

export { Parser, version };
