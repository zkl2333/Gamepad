import { server, TCPclients, wsServer } from './index.mjs';

export const initTCPServer = () => {
    server.on('listening', function () {
        let address = server.address();
        console.log('TCP server listening on %j', address);
    });

    server.on('connection', (socket) => {
        const id = socket.remoteAddress + ':' + socket.remotePort;
        console.log('有新的客户端接入', id);
        TCPclients[id] = socket;
        socket.setEncoding('utf8');
        socket.on('data', (data) => {
            const msg = data.toString();
            console.log(msg);
            wsServer.clients.forEach((client) => {
                client.send(msg);
            });
        });
        socket.on('close', () => {
            delete TCPclients[id];
        });
        socket.on('error', (err) => {
            console.log(err);
            delete TCPclients[id];
        })
    });

    //设置关闭时的回调函数
    server.on('close', function () {
        console.log('服务已关闭');
    });

    //设置出错时的回调函数
    server.on('error', function (err) {
        console.log('服务运行异常', err);
    });

};
