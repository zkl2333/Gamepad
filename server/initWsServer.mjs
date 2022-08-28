import { WSServer } from './index.mjs';

export const initWsServer = () => {
    return WSServer.on('connection', function connection(ws) {
        ws.on('message', function message(data) {
            console.log(`wsServer got: ${data}`);
        });
    });
};
