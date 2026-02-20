// these are the primitive types
console.log("=== 0) Basics ===");
console.log("Hello World");
let num = 5;
console.log("num:", num, typeof num);
let str = "hello world";
console.log("str:", str, typeof str);
let isTrue = true;
console.log("isTrue:", isTrue, typeof isTrue);
let inferred = 42;
console.log("inferred:", inferred, typeof inferred);
let loose = { x: 0 };
console.log("loose:", loose, typeof loose);
console.log("");
// =======================================================
console.log("=== 1) Arrays + Objects ===");
let numArray = [1, 2, 3, 4];
console.log("numArray:", numArray);
let position = { x: 10, y: 20 };
console.log("position:", position);
console.log("");
// =======================================================
console.log("=== 2) Functions ===");
function helloWorld(name, year) {
    console.log(`Hello ${name} it is the year ${year}`);
}
helloWorld("Ahmed", 2026);
const shout = (s) => s.toUpperCase();
console.log(shout("bob"));
const names = ["Alice", "Bob", "Eve"];
names.forEach((s) => console.log(s.toUpperCase()));
console.log("");
// =======================================================
console.log("=== 3) Interfaces ===");
const examplePlayer = {
    id: "p1",
    name: "Ahmed",
    x: 1,
    y: 2,
};
let state = {
    players: [examplePlayer],
    timestamp: Date.now(),
};
console.log("state:", state);
console.log("");
// =======================================================
console.log("=== 4) Union Types ===");
let dir = "UP";
console.log("dir:", dir);
console.log("");
// =======================================================
console.log("=== 5) Classes ===");
class User {
    constructor(name, age) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "age", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.age = age;
    }
    greet() {
        return `Hi, I'm ${this.name} and I'm ${this.age} years old`;
    }
}
const user = new User("Ahmed", 19);
console.log(user.greet());
console.log("");
// =======================================================
console.log("=== 6) Typed Messages ===");
function encode(msg) {
    return JSON.stringify(msg);
}
function decode(raw) {
    try {
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== "object")
            return null;
        if (!("type" in obj))
            return null;
        return obj;
    }
    catch {
        return null;
    }
}
const joinDemo = {
    type: "JOIN",
    payload: { name: "Ahmed" },
};
console.log("encoded JOIN:", encode(joinDemo));
console.log("");
// =======================================================
console.log("=== 7) WebSocket Client ===");
console.log("=== 7) WebSocket Client (Browser) ===");
const SERVER_URL = "ws://localhost:8080";
const PLAYER_NAME = "Ahmed"; // or prompt/localStorage/etc.
let myId = null;
let gameState = { players: [], timestamp: Date.now() };
function render() {
    console.clear();
    console.log("Server:", SERVER_URL);
    console.log("Name:", PLAYER_NAME);
    if (myId)
        console.log("My ID:", myId);
    console.log("Players:", gameState.players.length);
    console.log("");
    for (const p of gameState.players) {
        const me = p.id === myId ? " (me)" : "";
        console.log(`${p.name}${me} @ (${p.x}, ${p.y})`);
    }
    console.log("");
    console.log("Controls: WASD / Arrow keys to move");
}
function send(ws, msg) {
    if (ws.readyState === globalThis.WebSocket.OPEN) {
        ws.send(encode(msg));
    }
}
function keyToDirection(key) {
    switch (key) {
        case "w":
        case "arrowup":
            return "UP";
        case "a":
        case "arrowleft":
            return "LEFT";
        case "s":
        case "arrowdown":
            return "DOWN";
        case "d":
        case "arrowright":
            return "RIGHT";
        default:
            return null;
    }
}
const ws = new globalThis.WebSocket(SERVER_URL);
ws.addEventListener("open", () => {
    console.log("Connected");
    send(ws, { type: "JOIN", payload: { name: PLAYER_NAME } });
    render();
});
ws.addEventListener("message", (event) => {
    const raw = String(event.data);
    const msg = decode(raw);
    if (!msg)
        return;
    switch (msg.type) {
        case "WELCOME":
            myId = msg.payload.id;
            render();
            break;
        case "GAME_STATE":
            gameState = msg.payload;
            render();
            break;
        case "ERROR":
            console.log("Server error:", msg.payload.message);
            break;
    }
});
ws.addEventListener("close", () => {
    console.log("Disconnected");
});
ws.addEventListener("error", () => {
    console.log("WebSocket error");
});
document.addEventListener("keydown", (e) => {
    const direction = keyToDirection(e.key.toLowerCase());
    if (!direction)
        return;
    if (e.key.startsWith("Arrow"))
        e.preventDefault();
    send(ws, { type: "MOVE", payload: { direction } });
});
export {};
