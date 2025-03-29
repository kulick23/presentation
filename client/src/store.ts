import socket from "./utils/socket";
import { create } from "zustand";

export interface Slide {
  id: string;
  content: string;
  order: number; 
}

export interface User {
  id: string;
  name: string;
  role: "creator" | "editor" | "viewer";
}

interface PresentationState {
  slides: Slide[];
  users: User[];
  globalStyle: {
    textColor: string;
    backgroundColor: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
  joinPresentation: (presentationId: string, user: User) => void;
  addSlide: () => Slide;
  updateSlide: (id: string, newContent: string) => void;
  deleteSlide: (slideId: string) => void;
  changeUserRole: (presentationId: string, userId: string, newRole: "editor" | "viewer") => void;
  moveSlide: (slideId: string, direction: "up" | "down") => void; 
  reorderSlides: (newSlides: Slide[]) => void; 
  setGlobalStyle: (style: Partial<PresentationState["globalStyle"]>) => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  slides: [],
  users: [],
  globalStyle: {
    textColor: "#ffffff",
    backgroundColor: "rgba(27, 27, 27, 1)",
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Arial",
  },
  
  joinPresentation: (presentationId, user) => {
    socket.emit("joinPresentation", { presentationId, user });
    
    socket.on("loadSlides", (slides) => {
      set({ slides });
    });
    
    socket.on("updateSlide", (slide) => {
      set((state) => ({
        slides: state.slides.map((s) => (s.id === slide.id ? slide : s)),
      }));
    });
    
    socket.on("updateUsers", (users: User[]) => {
      set({ users });
    });
    
    socket.on("newSlide", (slide: Slide) => {
      set((state) => {
        if (state.slides.find((s) => s.id === slide.id)) {
          return state;
        }
        return { slides: [...state.slides, slide] };
      });
    });

    socket.on("slideDeleted", (slideId: string) => {
      set((state) => ({
        slides: state.slides.filter((s) => s.id !== slideId),
      }));
    });
  },

  addSlide: () => {
    const currentSlides = get().slides;
    const newSlide: Slide = { id: Date.now().toString(), content: "", order: currentSlides.length + 1 };
    set((state) => ({ slides: [...state.slides, newSlide] }));
    socket.emit("addSlide", { presentationId: "123", slide: newSlide });
    return newSlide;
  },

  updateSlide: (id, newContent) => {
    set((state) => {
      const oldSlide = state.slides.find((s) => s.id === id);
      if (!oldSlide) return {};
      const updatedSlide = { ...oldSlide, content: newContent };
      return {
        slides: state.slides.map((s) => (s.id === id ? updatedSlide : s)),
      };
    });

    const updated = get().slides.find((s) => s.id === id);
    socket.emit("updateSlide", { presentationId: "123", slide: updated });
  },

  deleteSlide: (slideId) => {
    set((state) => ({
      slides: state.slides.filter((slide) => slide.id !== slideId),
    }));
    socket.emit("deleteSlide", { presentationId: "123", slideId });
  },

  changeUserRole: (presentationId, userId, newRole) => {
    socket.emit("changeRole", { presentationId, userId, newRole });
  },

  moveSlide: (slideId, direction) => {
    set((state) => {
      const slides = [...state.slides].sort((a, b) => a.order - b.order);
      const index = slides.findIndex((s) => s.id === slideId);
      if (index === -1) return {};
      if (direction === "up" && index > 0) {
        const temp = slides[index - 1].order;
        slides[index - 1].order = slides[index].order;
        slides[index].order = temp;
      } else if (direction === "down" && index < slides.length - 1) {
        const temp = slides[index + 1].order;
        slides[index + 1].order = slides[index].order;
        slides[index].order = temp;
      }
      return { slides };
    });
  },

  reorderSlides: (newSlides) => {
    set({ slides: newSlides });
  },

  setGlobalStyle: (style) => {
    set((state) => ({
      globalStyle: { ...state.globalStyle, ...style },
    }));
  },
}));
