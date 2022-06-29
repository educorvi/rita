import {
    Plugin,
    UsageError,
    logger as ritaLogger,
    UndefinedPathError,
} from '@educorvi/rita';
import axios from 'axios';

/**
 * Get the value of an object property or array by a path that is passed as string
 * @param o object
 * @param s path
 * @private
 */
function getPropertyByString(o: any, s: string): boolean | string | number {
    s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            throw new UndefinedPathError('Undefinded path in data: ' + s);
        }
    }
    return o;
}

/**
 * Set the value of an object property or array by a path that is passed as string
 * @param o object
 * @param s path
 * @param v value
 * @private
 */
function setPropertyByString(o: any, s: string, v: any): any {
    s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    let curr = o;
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (!(k in curr)) {
            if (i === a.length - 1) {
                curr[k] = v;
            } else {
                curr[k] = {};
            }
        }
        curr = curr[k];
    }
    return o;
}

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
        const { method, url, limitTo } = this.options;

        // Test if url is valid
        if (!url) throw new UsageError('No URL for http plugin set');

        // Test if method is valid
        if (!(!method || method === 'GET' || method === 'POST'))
            throw new UsageError('Unknown HTTP method');

        // Limit postdata to given keys if limitTo is defined
        let postData = data;
        if (limitTo && method === 'POST') {
            postData = {};
            for (const limitToVal of limitTo) {
                setPropertyByString(
                    postData,
                    limitToVal,
                    getPropertyByString(data, limitToVal)
                );
            }
        }

        // Make request
        let result: Record<any, any>;
        try {
            logger.debug(`Requesting ${url} (${method || 'GET'})`);
            switch (method) {
                case 'POST':
                    result = (await axios.post(this.options.url, postData))
                        .data;
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
