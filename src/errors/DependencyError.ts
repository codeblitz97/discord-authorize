import { CustomError } from "./DiscordAPIErrors";

export class MissingDependencyError extends CustomError {
  constructor(message: string) {
    super("MissingDependencyError", message);
  }
}
