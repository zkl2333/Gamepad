import { UDPServer } from './index.mjs';

// UDP客户端IP池
export const UDPclientIPs = [];
// UDP客户端健康检查定时器集合
export const UDPclientHealthCheckTimer = {};

// 打印UDP客户端IP池
const printUDPclientIPs = () => {
    if (UDPclientIPs.length === 0) {
        console.log('UDP客户端IP池为空');
    } else {
        console.log(`当前UDP客户端池：${UDPclientIPs}`);
    }
}

export const initUDPServer = () => {
    // 初始化UDP服务器
    UDPServer.on('message', (msg, rinfo) => {
        // 加入客户端池
        if (msg.toString() === 'heartbeat') {
            // 回复心跳包
            UDPServer.send('heartbeat;', 8266, rinfo.address);
            if (!UDPclientIPs.includes(rinfo.address)) {
                UDPclientIPs.push(rinfo.address);
                console.log(`${rinfo.address} 加入了UDP客户端池`);
                printUDPclientIPs();
            }
        } else {
            console.log(`收到来自 ${rinfo.address} 的消息：${msg}`);
        }
        if (UDPclientHealthCheckTimer[rinfo.address]) {
            clearInterval(UDPclientHealthCheckTimer[rinfo.address]);
        }
        UDPclientHealthCheckTimer[rinfo.address] = setInterval(() => {
            console.log(`UDP客户端 ${rinfo.address} 心跳超时，移除`);
            UDPclientIPs.splice(UDPclientIPs.indexOf(rinfo.address), 1);
            printUDPclientIPs();
        }, 20000);
    }).on('listening', () => {
        const address = UDPServer.address();
        console.log('UDP server listening on %j', address);
    }).bind(8266);
};
