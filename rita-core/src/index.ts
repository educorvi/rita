export * from './Tools';
export * from './logicElements';
export * from './Logger';
export * from './Errors';
export {default as Parser, PluginClass} from './Parser';

const version = process.env.VERSION;

export { version };
