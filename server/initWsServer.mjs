import { wsServer } from './index.mjs';

export const initWsServer = () => {
    return wsServer.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log('received: %s', data);
        });
    });
};
