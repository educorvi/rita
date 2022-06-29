import { Plugin, UsageError, logger as ritaLogger } from '@educorvi/rita';
import axios from 'axios';

export default class HTTP_Plugin extends Plugin {
    getName(): string {
        return 'http';
    }

    getVersion(): string {
        return process.env.VERSION || '0.0.0';
    }

    async enrichData(
        data: Record<string, any>,
        logger = ritaLogger
    ): Promise<Record<string, any>> {
        const { method, url } = this.options;
        if (!url) throw new UsageError('No URL for http plugin set');
        if (!(!method || method === 'GET' || method === 'POST'))
            throw new UsageError('Unknown HTTP method');

        let result: Record<any, any>;
        try {
            logger.debug(`Requesting ${url} (${method || 'GET'})`);
            switch (method) {
                case 'POST':
                    result = (await axios.post(this.options.url, data)).data;
                    break;
                default:
                    result = (await axios.get(this.options.url)).data;
                    break;
            }
            logger.debug(result);
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

    validate(): boolean {
        return super.validate() && !!this.options.url;
    }
}
