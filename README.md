# Rapidnote API

Rapidnote is a free API for a fast ephemeral messaging platform. It allows users to send and receive messages in real-time, but messages older than 10 minutes are removed. You can create rooms and converse in them, but the number of rooms is limited and the number of messages per room as well.

## Limits

 - Messages older than 10 minutes are deleted.
 - There is a limit of 50 rooms. When this limit is reached and a user adds a new one, the room with the oldest activity is removed automatically.
 - The room with name 'root' can never be deleted.
 - There is a limit of 100 messages per room. When this limit is reached and a user adds a new one, the oldest message is removed automatically.

## Features

- **Fast Messaging:** Send and receive messages quickly.
- **Room Support:** Messages can be scoped to rooms
- **Message Expiry:** Messages are automatically removed after 10 minutes.
- **Message Limit:** Each room has a message limit of 100, ensuring efficient use of resources.
- **Content Filtering:** Filters out swear words and URLs to maintain a positive environment.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/artus/rapidnote.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rapidnote
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate swagger, compile the typescript code, and run the application:

   ```bash
   npm run build-and-run
   ```

## Swagger Documentation

Access Swagger documentation to explore and test the API endpoints.

```http
GET /api-docs
```

## Frontend

A basic frontend has been added, and can be used by just navigating to the root of the server (e.g. `localhost:3000`);

## License

This project is licensed under the [MIT License](LICENSE).