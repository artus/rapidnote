const FORBIDDEN_WORDS = ["swearword1", "swearword2", "swearword3"];

export const validateNoForbiddenContent = (message: string) => {
  const forbiddenWords = ["swearword1", "swearword2", "swearword3"];
  const forbiddenWordsRegex = new RegExp(forbiddenWords.join("|"), "gi");
  if (forbiddenWordsRegex.test(message)) {
    throw new Error("You submitted content that is not allowed.");
  }
}