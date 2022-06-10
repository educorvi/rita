import { Route, Get, Controller, Example } from 'tsoa';
import { version } from '../../package.json';
import { version as ritaVersion } from '@educorvi/rita';

/**
 * Root controller
 */

type welcomeMessage = {
    version: string;
    message: string;
    ritaVersion: string;
};

@Route('/')
export class RootController extends Controller {
    @Example<welcomeMessage>({
        version: '3.0.0',
        message: 'Welcome to the RITA API.',
        ritaVersion: '3.0.1',
    })
    @Get('/')
    public async getWelcome(): Promise<welcomeMessage> {
        return {
            version,
            message:
                'Welcome to the RITA API. A documentation is available under ./docs.',
            ritaVersion,
        };
    }
}
