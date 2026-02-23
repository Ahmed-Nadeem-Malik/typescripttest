// these are the primitive types

console.log("=== 0) Basics ===")

console.log("Hello World")

let num: number = 5
console.log("num:", num, typeof num)

let str: string = "hello world"
console.log("str:", str, typeof str)

let isTrue = true
console.log("isTrue:", isTrue, typeof isTrue)

let inferred = 42
console.log("inferred:", inferred, typeof inferred)

let loose: any = {x: 0}
console.log("loose:", loose, typeof loose)

console.log("")

// =======================================================

console.log("=== 1) Arrays + Objects ===")

let numArray: number[] = [1, 2, 3, 4]
console.log("numArray:", numArray)

type coordinates = {
    x: number,
    y: number,
}
let position: coordinates = {x: 10, y: 20}
console.log("position:", position)

console.log("")

// =======================================================

console.log("=== 2) Functions ===")

function helloWorld(name: string, year: number): void {
    console.log(`Hello ${name} it is the year ${year}`)
}

helloWorld("Ahmed", 2026)

const shout = (s: string): string => s.toUpperCase()
console.log(shout("bob"))

const names = ["Alice", "Bob", "Eve"]
names.forEach((s) => console.log(s.toUpperCase()))

console.log("")

// =======================================================

console.log("=== 3) Interfaces ===")

interface Player {
    id: string
    name: string
    x: number
    y: number
}


interface GameState {
    players: Player[]
    timestamp: number
}

const examplePlayer: Player = {
    id: "p1",
    name: "Ahmed",
    x: 1,
    y: 2,
}

let state: GameState = {
    players: [examplePlayer],
    timestamp: Date.now(),
}

console.log("state:", state)

console.log("")

// =======================================================

console.log("=== 4) Union Types ===")

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

let dir: Direction = "UP"
console.log("dir:", dir)

console.log("")

// =======================================================

console.log("=== 5) Classes ===")

class User {
    name: string
    age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }

    greet(): string {
        return `Hi, I'm ${this.name} and I'm ${this.age} years old`
    }
}

const user = new User("Ahmed", 19)
console.log(user.greet())

console.log("")

// =======================================================

console.log("=== 6) Typed Messages ===")

type ClientMessage =
    | { type: "JOIN"; payload: { name: string } }
    | { type: "MOVE"; payload: { direction: Direction } }

type ServerMessage =
    | { type: "WELCOME"; payload: { id: string } }
    | { type: "GAME_STATE"; payload: GameState }
    | { type: "ERROR"; payload: { message: string } }

function encode(msg: ClientMessage): string {
    return JSON.stringify(msg)
}

function decode(raw: string): ServerMessage | null {
    try {
        const obj = JSON.parse(raw) as ServerMessage
        if (!obj || typeof obj !== "object") return null
        if (!("type" in obj)) return null
        return obj
    } catch {
        return null
    }
}

const joinDemo: ClientMessage = {
    type: "JOIN",
    payload: {name: "Ahmed"},
}

console.log("encoded JOIN:", encode(joinDemo))

console.log("")

// =======================================================

console.log("=== 7) WebSocket Client ===")

const SERVER_URL = "ws://localhost:8080"
const PLAYER_NAME = "Ahmed"

let myId: string | null = null
let gameState: GameState = {players: [], timestamp: Date.now()}

function render() {
    console.clear()
    console.log("Server:", SERVER_URL)
    console.log("Name:", PLAYER_NAME)
    if (myId) console.log("My ID:", myId)
    console.log("Players:", gameState.players.length)
    console.log("")

    for (const p of gameState.players) {
        const me = p.id === myId ? " (me)" : ""
        console.log(`${p.name}${me} @ (${p.x}, ${p.y})`)
    }

    console.log("")
    console.log("Controls: WASD / Arrow keys to move")
}

function send(ws: WebSocket, msg: ClientMessage) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(encode(msg))
    }
}

function keyToDirection(key: string): Direction | null {
    switch (key) {
        case "w":
        case "arrowup":
            return "UP"
        case "a":
        case "arrowleft":
            return "LEFT"
        case "s":
        case "arrowdown":
            return "DOWN"
        case "d":
        case "arrowright":
            return "RIGHT"
        default:
            return null
    }
}

const ws = new WebSocket(SERVER_URL)

ws.onopen = () => {
    console.log("Connected")
    send(ws, {type: "JOIN", payload: {name: PLAYER_NAME}})
    render()
}

ws.onmessage = (event: MessageEvent) => {
    const raw = String(event.data)
    const msg = decode(raw)
    if (!msg) return

    switch (msg.type) {
        case "WELCOME":
            myId = msg.payload.id
            render()
            break
        case "GAME_STATE":
            gameState = msg.payload
            render()
            break
        case "ERROR":
            console.log("Server error:", msg.payload.message)
            break
    }
}

ws.onclose = () => {
    console.log("Disconnected")
}

ws.onerror = () => {
    console.log("WebSocket error")
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
    const direction = keyToDirection(e.key.toLowerCase())
    if (!direction) return

    if (e.key.startsWith("Arrow")) e.preventDefault()

    send(ws, {type: "MOVE", payload: {direction}})
})