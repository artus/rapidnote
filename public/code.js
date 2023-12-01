let activeRoom = "root";
let rooms = ["root"];

const usernames = [
  "SilentShadow",
  "WhisperWiz",
  "GhostGazer",
  "CipherScribe",
  "MysticMuse",
  "Inkling",
  "ChatterCharm",
  "StealthySoul",
  "EchoExplorer",
  "CrypticCraze",
  "VeilVoyage",
  "EnigmaEmissary",
  "PuzzlePilot",
  "SleekSeeker",
  "WhizWhisper",
  "RiddleRover",
  "PhantomPonder",
  "HushHaven",
  "SlySprite",
  "MingleMystery",
  "CleverCognomen",
  "BlissfulBlip",
  "ShadowSnip",
  "WhisperWhirl",
  "NebulaNudger",
  "MysteryMarauder",
  "CrypticCaster",
  "StealthStrive",
  "WhisperWeaver",
  "PhantomPilot",
  "MysticMingle",
  "HushedHarbor",
  "SilentScribble",
  "WhizWander",
  "SneakSnare",
  "RiddleRipple",
  "GhostGlide",
  "CrypticCipher",
  "VeilVortex",
  "MingleMurmur",
  "HushHarmony",
  "StealthStitch",
  "WhisperWaltz",
  "EchoEclipse",
  "ShadowSpark",
  "MysticMingle",
  "SlySilhouette",
  "CrypticChirp",
  "WhizWhim",
  "RiddleRift",
  "SilentShade",
  "WhisperWhirl",
  "SneakSavor",
  "MingleMystic",
  "CrypticCraft",
  "VeilVerve",
  "StealthSavor",
  "HushHarbor",
  "SlySpire",
  "MysticMingle",
  "WhisperWink",
  "RiddleRiff",
  "GhostGlide",
  "SilentStitch",
  "CrypticCraze",
  "VeilVortex",
  "WhizWhisper",
  "SneakSnare",
  "MingleMurmur",
  "HushHarmony",
  "StealthStrive",
  "WhisperWeaver",
  "PhantomPilot",
  "MysticMingle",
  "HushedHarbor",
  "SilentScribble",
  "WhizWander",
  "SlySilhouette",
  "CrypticChirp",
  "WhizWhim",
  "RiddleRift",
  "SilentShade",
  "WhisperWhirl",
  "SneakSavor",
  "MingleMystic",
  "CrypticCraft",
  "VeilVerve",
  "StealthSavor",
  "HushHarbor",
  "SlySpire",
  "MysticMingle",
  "WhisperWink",
  "RiddleRiff",
  "GhostGlide",
];

const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
document.getElementById("username").value = randomUsername;

const renderRooms = () => {
  const roomsContainer = document.getElementById("room-list");
  roomsContainer.innerHTML = "";

  for (const room of rooms) {
    const roomElement = document.createElement("li");

    roomElement.addEventListener("click", () => {
      setActiveRoom(room);
      fetchMessages();
    });

    roomElement.textContent = room;
    roomsContainer.appendChild(roomElement);
  }
};

const fetchRooms = async () => {
  const response = await fetch("/rooms");
  rooms = await response.json();

  document.getElementById("room-count").textContent = `(${rooms.length})`;

  renderRooms();
};

const fetchMessages = async () => {
  const room = activeRoom;
  const response = await fetch(`/rooms/${room}`);
  const data = await response.json();

  const messagesContainer = document.getElementById("message-list");
  messagesContainer.innerHTML = "";

  if (data.messages.length === 0) {
    const messageElement = document.createElement("li");
    messageElement.textContent = "No messages yet.";
    messagesContainer.appendChild(messageElement);
  } else {
    document.title = `${room} - ${data.messages.length} messages`;
    for (const message of data.messages) {
      const messageElement = document.createElement("li");
      messageElement.classList.add("list-item");
      messageElement.title = `Sent: ${message.timestamp}`;
      messageElement.innerHTML = `<span class="username">${message.username}:</span> <span class="message">${message.content}</span>`;
      messageElement.addEventListener("click", () => {
        document.getElementById("message").value = `@${message.username}:`;
        document.getElementById("message").focus();
      });
      messagesContainer.appendChild(messageElement);
    }
  }
};

const addMessage = async (content, username) => {
  if (content.length < 1 || content.length > 140) {
    return;
  }

  if (username.length > 20) {
    return;
  }

  username = username || "Anonymous";

  await fetch(`/rooms/${activeRoom}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      username,
    }),
  });

  fetchMessages();
};

const setActiveRoom = async (name) => {
  activeRoom = name;
  document.getElementById("active-room").textContent = name;
};

const addRoom = async (name) => {
  if (name.length < 1 || name.length > 20) {
    return;
  }

  if (rooms.includes(name.toLowerCase())) {
    return;
  }

  await setActiveRoom(name);
  await addMessage(`Welcome to room '${name}'!`, "Rapidnote");
  await fetchRooms();
};

fetchRooms();
fetchMessages();

document
  .getElementById("add-message-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const content = document.getElementById("message").value;
    const username = document.getElementById("username").value;

    await addMessage(content, username);
    document.getElementById("message").value = "";
  });

document
  .getElementById("create-room-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("room").value;

    await addRoom(name);
    document.getElementById("room").value = "";
  });

setInterval(() => {
  fetchMessages();
  fetchRooms();
}, 10000)