import validator from 'valivalue';
import { InMessageDTO, Message, OutMessageDTO } from './message';
import { DateTime } from 'luxon';

export const DEFAULT_ROOM = 'root';
const MAX_MESSAGES_PER_ROOM = 100;
const MAX_ROOMS = 50;
const TEN_MINUTES = 1000 * 60 * 10;

export interface OutRoomDTO {
  name: string;
  messages: OutMessageDTO[];
  lastActivity: string;
}

export class Room {

  readonly name: string;

  constructor(
    name: string,
    public lastActivity = DateTime.now(),
    public messages: Message[] = []
  ) {
    validator.objects.validateNotNullOrUndefined(name, 'Room name must be provided.');
    validator.objects.validateNotNullOrUndefined(messages, 'Messages must be provided.');
    validator.strings.validateMinAndMaxLength(name, 1, 20, 'Room name must be between 1 and 20 characters long.');

    this.name = name.toLowerCase();
  }

  addMessage(message: Message) {
    this.removeOlderMessages();
    this.lastActivity = DateTime.now();
    if (this.messages.length >= MAX_MESSAGES_PER_ROOM) {
      this.messages.shift();
    }
    this.messages.push(message);
  }

  removeOlderMessages() {
    this.messages = this.messages.filter((message) => Math.abs(message.timestamp.diffNow().milliseconds) < TEN_MINUTES);
  }

  toDTO(): OutRoomDTO {
    this.removeOlderMessages();
    return {
      name: this.name,
      messages: this.messages.map((message) => message.toDTO()),
      lastActivity: this.lastActivity.toISO()
    }
  }
}

export class Rooms {
  constructor(
    public rooms: Room[] = [
      new Room(DEFAULT_ROOM),
      new Room("tech"),
      new Room("random"),
      new Room("games"),
      new Room("movies"),
      new Room("music"),
      new Room("sports")
    ]
  ) {
    validator.objects.validateNotNullOrUndefined(rooms, 'Rooms must be provided.');
  }

  getRoom(room: string) {
    return this.rooms.find((g) => g.name === room.toLowerCase());
  }

  roomExists(room: string) {
    return this.rooms.some((g) => g.name === room.toLowerCase());
  }

  removeOldestRoom() {
    const oldestRoom = this.rooms.sort((a, b) => a.lastActivity.diff(b.lastActivity).milliseconds)[0];
    if (oldestRoom.name === DEFAULT_ROOM) {
      oldestRoom.lastActivity = DateTime.now();
      this.removeOldestRoom();
    } else {
      const oldestRoomIndex = this.rooms.findIndex((room) => room.name === oldestRoom.name);
      this.rooms.splice(oldestRoomIndex, 1);
    }
  }

  addMessage(message: InMessageDTO, room = DEFAULT_ROOM): OutRoomDTO {
    if (this.roomExists(room)) {
      const foundRoom = this.getRoom(room);
      foundRoom!.addMessage(Message.fromDTO(message, foundRoom!.messages.length + 1));
      return foundRoom!.toDTO();
    } else {
      if (this.rooms.length >= MAX_ROOMS) {
        this.removeOldestRoom();
      }
      const newRoom = new Room(room);
      newRoom.addMessage(Message.fromDTO(message, 1));
      this.rooms.push(newRoom);
      return newRoom.toDTO();
    }
  }

  getRoomNames() {
    return this.rooms.map((room) => room.name);
  }

  getRoomDTO(room = DEFAULT_ROOM) {
    if (!this.roomExists(room)) {
      throw new Error(`Room '${room}' does not exist.`);
    }
    return this.getRoom(room)!.toDTO();
  }
}