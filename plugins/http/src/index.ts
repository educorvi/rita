import { Plugin, UsageError } from '@educorvi/rita';
import axios from 'axios';

const version = process.env.VERSION;

export { version };

export default class HTTP_Plugin extends Plugin {
    async enrichData(data: Record<string, any>): Promise<Record<string, any>> {
        if (!this.options.url)
            throw new UsageError('No URL for http plugin set');
        let result;
        try {
            result = (await axios.get(this.options.url)).data;
        } catch (e) {
            throw new UsageError(
                'Could not fetch ' + this.options.url + ': ' + JSON.stringify(e)
            );
        }
        return {
            ...data,
            ...result,
        };
    }
}
