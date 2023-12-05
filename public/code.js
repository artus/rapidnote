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

const addToast = (message) => {
  const toastContainer = document.getElementById("toast-container");
  const toastElement = document.createElement("p");
  toastElement.textContent = message;
  toastContainer.appendChild(toastElement);
  toastElement.classList.add("toast");
  toastElement.addEventListener("click", () => {
    toastElement.remove();
  });
  setTimeout(() => {
    toastElement.remove();
  }, 3000);
};

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
  try {
    const response = await fetch("/rooms");
    rooms = await response.json();

    if (!response.ok) {
      throw new Error(rooms.error);
    }

    document.getElementById("room-count").textContent = `(${rooms.length})`;
    renderRooms();
  } catch (error) {
    addToast(`Failed to fetch rooms: ${error.message}`);
  }
};

const fetchMessages = async () => {
  try {
    const room = activeRoom;
    const response = await fetch(`/rooms/${room}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

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
  } catch (error) {
    addToast(`Failed to fetch messages: ${error.message}`);
  }
};

const addMessage = async (content, username) => {
  try {
    if (content.length < 1 || content.length > 140) {
      addToast("Message must be between 1 and 140 characters.");
      return;
    }

    if (username.length > 20) {
      addToast("Username must be less than 20 characters.");
      return;
    }

    username = username || "Anonymous";

    const response = await fetch(`/rooms/${activeRoom}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        username,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    fetchMessages();
  } catch (error) {
    addToast(`Failed to add message: ${error.message}`);
  }
};

const setActiveRoom = async (name) => {
  activeRoom = name;
  document.getElementById("active-room").textContent = name;
};

const addRoom = async (name) => {
  if (name.length < 1 || name.length > 20) {
    addToast("Room name must be between 1 and 20 characters.");
    return;
  }

  if (rooms.includes(name.toLowerCase())) {
    addToast("Room name must be unique.");
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
}, 10000);
