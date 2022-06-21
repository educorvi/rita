import { Route, Get, Controller, Example } from 'tsoa';
import { version } from '../../package.json';
import { version as ritaVersion } from '@educorvi/rita';
import { plugins } from '../helper/globals';

/**
 * Root controller
 */

type welcomeMessage = {
    version: string;
    message: string;
    ritaVersion: string;
    plugins: Array<Record<string, string>>;
};

@Route('/')
export class RootController extends Controller {
    @Example<welcomeMessage>({
        version: '3.0.0',
        message: 'Welcome to the RITA API.',
        ritaVersion: '3.0.1',
        plugins: [],
    })
    @Get('/')
    public async getWelcome(): Promise<welcomeMessage> {
        return {
            version,
            message:
                'Welcome to the RITA API. A documentation is available under ./docs.',
            ritaVersion,
            plugins: plugins.map((P) => {
                const p = new P({}, null);
                return {
                    name: p.getName(),
                    version: p.getVersion(),
                };
            }),
        };
    }
}
