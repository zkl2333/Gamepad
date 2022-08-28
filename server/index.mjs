import net from 'net';
import { WebSocketServer } from 'ws';
import { initTCPServer, TCPclients } from './initTCPServer.mjs';
import { initWsServer } from './initWsServer.mjs';
import dgram from 'dgram';
import { initUDPServer, UDPclientIPs } from './initUDPServer.mjs';

// 创建TCP服务器
export const TCPServer = net.createServer().listen(1024, '0.0.0.0');
// 创建websocekt服务器
export const WSServer = new WebSocketServer({ port: 8080 });
// 创建UDP服务器
export const UDPServer = dgram.createSocket('udp4');

// 初始化TCP服务器
initTCPServer();
// 初始化websocekt服务器
initWsServer();
// 初始化UDP服务器
initUDPServer();

// Ws会话处理
WSServer.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        // 转发数据到UDP服务器
        UDPclientIPs.forEach(ip => {
            UDPServer.send(data, 8266, ip)
        })
        // 转发给TCP客户端
        for (let key in TCPclients) {
            TCPclients[key].write(data);
        }
    })
})