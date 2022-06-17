import { Plugin } from '@educorvi/rita';

const version = process.env.VERSION;

export { version };

export default class HTTP_Plugin extends Plugin {
    enrichData(data: Record<string, any>): Record<string, any> {
        return {
            ...data,
        };
    }
}
