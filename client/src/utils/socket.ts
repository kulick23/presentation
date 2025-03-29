import { io } from "socket.io-client";

const socket = io("https://presentation-production-650c.up.railway.app");

export default socket;
