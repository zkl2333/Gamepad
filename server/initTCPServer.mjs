import { TCPServer, WSServer } from './index.mjs';

// TCP连接池
export const TCPclients = {};

export const initTCPServer = () => {
    TCPServer.on('listening', function () {
        let address = TCPServer.address();
        console.log('TCP server listening on %j', address);
    });

    TCPServer.on('connection', (socket) => {
        const id = socket.remoteAddress + ':' + socket.remotePort;
        console.log('有新的客户端接入', id);
        TCPclients[id] = socket;
        socket.setEncoding('utf8');
        socket.on('data', (data) => {
            const msg = data.toString();
            console.log(msg);
            WSServer.clients.forEach((client) => {
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
    TCPServer.on('close', function () {
        console.log('服务已关闭');
    });

    //设置出错时的回调函数
    TCPServer.on('error', function (err) {
        console.log('服务运行异常', err);
    });

};
