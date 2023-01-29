import path from 'path';
import { elvana } from '@investager/common';

path.resolve('./next.config.js');

export default function Index() {
    return <div className="flex justify-center items-center">{elvana()}</div>;
}
