
declare global {
    interface Window { ServerUtils: any; }
}

window.ServerUtils = window.ServerUtils || {};

const Client = {
    PONG: {
        type: "PING",
        data: null,
    }
};

const Server = {

};

window.ServerUtils = { Packets: {Client, Server} };