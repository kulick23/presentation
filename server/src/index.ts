import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

interface Slide {
  id: string;
  content: string;
  order: number; 
  blocks?: any[];
}

interface Presentation {
  slides: Slide[];
  users: any[];
}

let presentations: Record<string, Presentation> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinPresentation", ({ presentationId, user }) => {
    const userWithSocket = { ...user, socketId: socket.id };

    if (!presentations[presentationId]) {
      presentations[presentationId] = {
        slides: [{ id: "1", content: "", order: 1, blocks: [] }],
        users: [],
      };
    }
    presentations[presentationId].users.push(userWithSocket);

    socket.join(presentationId);
    io.to(presentationId).emit("updateUsers", presentations[presentationId].users);
    socket.emit("loadSlides", presentations[presentationId].slides);
  });

  socket.on("updateSlide", ({ presentationId, slide }) => {
    const pres = presentations[presentationId];
    if (!pres) return;
    const index = pres.slides.findIndex((s) => s.id === slide.id);
    if (index !== -1) {
      pres.slides[index] = { ...pres.slides[index], ...slide };
    }
    io.to(presentationId).emit("updateSlide", pres.slides[index]);
  });

  socket.on("addBlock", ({ slideId, block, presentationId }) => {
    const pres = presentations[presentationId];
    if (pres) {
      const slide = pres.slides.find((s) => s.id === slideId);
      if (slide) {
        if (!slide.blocks) slide.blocks = [];
        slide.blocks.push(block);
        io.to(presentationId).emit("addBlock", { slideId, block });
      }
    }
  });

  socket.on("updateBlock", ({ slideId, block, presentationId }) => {
    const pres = presentations[presentationId];
    if (pres) {
      const slide = pres.slides.find((s) => s.id === slideId);
      if (slide && slide.blocks) {
        const index = slide.blocks.findIndex((b: any) => b.id === block.id);
        if (index !== -1) {
          slide.blocks[index] = block;
          io.to(presentationId).emit("updateBlock", { slideId, block });
        }
      }
    }
  });

  socket.on("addSlide", ({ presentationId, slide }) => {
    if (!presentations[presentationId]) return;
    presentations[presentationId].slides.push(slide);
    io.to(presentationId).emit("newSlide", slide);
  });

  socket.on("deleteSlide", ({ presentationId, slideId }) => {
    const pres = presentations[presentationId];
    if (pres) {
      pres.slides = pres.slides.filter((s) => s.id !== slideId);
      io.to(presentationId).emit("slideDeleted", slideId);
    }
  });

  socket.on("changeRole", ({ presentationId, userId, newRole }) => {
    const pres = presentations[presentationId];
    if (pres) {
      pres.users = pres.users.map((u: any) =>
        u.id === userId ? { ...u, role: newRole } : u
      );
      io.to(presentationId).emit("updateUsers", pres.users);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const presentationId in presentations) {
      const pres = presentations[presentationId];
      const prevLength = pres.users.length;
      pres.users = pres.users.filter((u: any) => u.socketId !== socket.id);
      if (pres.users.length !== prevLength) {
        io.to(presentationId).emit("updateUsers", pres.users);
      }
    }
  });
});

server.listen(5000, () => console.log("Server running on http://localhost:5000"));
