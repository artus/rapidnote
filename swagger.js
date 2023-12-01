const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rapidnote API Documentation",
      version: "1.0.0",
      description:
        "A simple API that allows you to have ephemeral chat conversations, scoped by rooms.",
    },
    components: {
      schemas: {
        InMessageDTO: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Message content",
            },
            username: {
              type: "string",
              description: "User that sent the message",
            },
          },
        },
        OutMessageDTO: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Message ID",
            },
            content: {
              type: "string",
              description: "Message content",
            },
            username: {
              type: "string",
              description: "User that sent the message",
            },
            timestamp: {
              type: "string",
              description: "Message timestamp in ISO format",
            },
          },
        },
        OutRoomDTO: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Room name",
            },
            messages: {
              type: "array",
              description: "Room messages",
              items: {
                $ref: "#/components/schemas/OutMessageDTO",
              },
            },
            lastActivity: {
              type: "string",
              description: "Last room activity in ISO format",
            },
          },
        },
      },
    },
  },
  apis: ["./src/server.ts"], // Your API files
};

const specs = swaggerJsdoc(options);

fs.writeFileSync(
  path.join(__dirname, "./src/swagger.json"),
  JSON.stringify(specs, null, 2)
);

module.exports = specs;
