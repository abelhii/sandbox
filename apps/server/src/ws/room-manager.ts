import { EventEmitter } from "node:events";
import { RoomEvent } from "../schemas/room-event.schema.ts";

type RoomListener = (event: RoomEvent) => void;

class RoomManager {
  // One EventEmitter per room, created on demand
  private emitters = new Map<string, EventEmitter>();

  // Track active sessions per room (useful for "who's online" later)
  private members = new Map<string, Set<string>>(); // roomId → Set<sessionId>

  private getEmitter(roomId: string): EventEmitter {
    if (!this.emitters.has(roomId)) {
      this.emitters.set(roomId, new EventEmitter());
    }
    return this.emitters.get(roomId)!;
  }

  join(roomId: string, sessionId: string, displayName: string) {
    if (!this.members.has(roomId)) {
      this.members.set(roomId, new Set());
    }
    this.members.get(roomId)!.add(sessionId);

    this.emit(roomId, {
      type: "user_joined",
      displayName,
      timestamp: new Date(),
    });
  }

  leave(roomId: string, sessionId: string, displayName: string) {
    this.members.get(roomId)?.delete(sessionId);

    this.emit(roomId, {
      type: "user_left",
      displayName,
      timestamp: new Date(),
    });

    // Clean up emitter if room is empty
    if ((this.members.get(roomId)?.size ?? 0) === 0) {
      this.emitters.delete(roomId);
      this.members.delete(roomId);
    }
  }

  emit(roomId: string, event: RoomEvent) {
    this.getEmitter(roomId).emit("event", event);
  }

  subscribe(roomId: string, listener: RoomListener): () => void {
    const emitter = this.getEmitter(roomId);
    emitter.on("event", listener);

    // Return an unsubscribe function — caller is responsible for cleanup
    return () => emitter.off("event", listener);
  }

  getMembers(roomId: string): Set<string> {
    return this.members.get(roomId) ?? new Set();
  }
}

// Singleton — one instance for the whole process
export const roomManager = new RoomManager();
