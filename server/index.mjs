import net from 'net';
import { WebSocketServer } from 'ws';
import { initTCPServer } from './initTCPServer.mjs';
import { initWsServer } from './initWsServer.mjs';
import dgram from 'dgram';

// 创建TCP服务器
export const server = net.createServer().listen(1024, '0.0.0.0');
// 创建websocekt服务器
export const wsServer = new WebSocketServer({ port: 8080 });
// 创建UDP服务器
export const udpServer = dgram.createSocket('udp4');

// 连接池
export const TCPclients = {};

// 初始化TCP服务器
initTCPServer();
// 初始化websocekt服务器
initWsServer();


// Ws会话处理
wsServer.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        // 转发数据到UDP服务器
        udpServer.send(data, 8266, '192.168.8.111')
        // 转发给TCP客户端
        for (let key in TCPclients) {
            TCPclients[key].write(data);
        }
    })
})