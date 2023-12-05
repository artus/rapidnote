import { DateTime } from "luxon";
import validator from "valivalue";

export interface InMessageDTO {
  content: string;
  username?: string;
}

export interface OutMessageDTO {
  id: number;
  content: string;
  username: string;
  timestamp: string;
}

export class Message {

  constructor(
    readonly id: number,
    readonly content: string,
    readonly username: string,
    readonly timestamp: DateTime
  ) {
    validator.objects.validateNotNullOrUndefined(content, "Content must be provided.");
    validator.objects.validateNotNullOrUndefined(username, "Username must be provided.");
    validator.strings.validateMinAndMaxLength(content, 1, 140, "Content must be between 1 and 140 characters long.");
    validator.strings.validateMinAndMaxLength(username, 1, 20, "Username must be between 1 and 20 characters long.");
    validator.objects.validateNotNullOrUndefined(timestamp, "Timestamp must be provided.");
  }

  static fromDTO(dto: InMessageDTO, id: number): Message {
    return new Message(
      id,
      dto.content,
      dto.username || "Anonymous",
      DateTime.now()
    );
  }

  toDTO(): OutMessageDTO {
    return {
      id: this.id,
      content: this.content,
      username: this.username,
      timestamp: this.timestamp.toISO()!
    };
  }
}