let ws = null;
let ping = null;
let isManuallyClosed = false;

const connectWebSocket = (roomID, username, getNewMSSG, onReconnect, manageLoading) => {
    ws = new WebSocket(`wss://chat-api-k4vi.onrender.com/ws/${roomID}/${username}`);
    ws.onopen = () => {
        console.log("Connected");
        if (manageLoading) manageLoading(false);
        ping = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ event: "ping" }));
                console.log("keeping alive");
            }
        }, 30000)
    };
    ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        getNewMSSG(newMessage);
    };
    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };
    ws.onclose = () => {
        console.log("WebSocket Disconnected");
        clearInterval(ping);
        if (manageLoading) manageLoading(true);
        if (!isManuallyClosed && onReconnect) {
            onReconnect();
        }
        isManuallyClosed = false;
    };
}

const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: "message", content: message }));
    } else {
        console.log("WebSocket is not open!");
    }
}

const closeWebSocket = (username) => {
    const leavemessage = `${username} has left the room ->joinleave->codac->@#$!`
    sendMessage(leavemessage);
    setTimeout(() => {
        clearInterval(ping);
        isManuallyClosed = true;
        console.log("cloasing.......");
        if (ws) ws.close();
    }, 200);
}

export { connectWebSocket, sendMessage, closeWebSocket };