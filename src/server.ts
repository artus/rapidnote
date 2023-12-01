import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import rateLimit from 'express-rate-limit';
import { Rooms } from './domain/room';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.json'; // Correct path based on your project structure
import dotenv from 'dotenv';

//For env File 
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// Limiter that rate limits to 1000 requests every 5 minutes.
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs,
});

// Middleware
app.use(bodyParser.json());
app.use(cors())
app.use(limiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const rooms = new Rooms();

app.use(express.static('public'))

/**
 * @openapi
 * /rooms/{room}:
 *   get:
 *     summary: Get list of rooms, or messages for a specific room.
 *     description: Get room list, or messages (and room info) for a specific room by providing the "room" path parameter.
 *     parameters:
 *       - in: path
 *         name: room
 *         description: The room identifier.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response. Returns room info or messages based on the presence of the "room" path parameter.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutRoomDTO'
 */
app.get('/rooms/:room?', (req: Request, res: Response) => {
  const { room } = req.params;

  if (room) {
    console.log(`Received GET for room '${room}'.`);
    res.json(rooms.getRoomDTO(room));
  } else {
    console.log(`Received GET for room list.`)
    res.json(rooms.getRoomNames());
  }
});

/**
 * @openapi
 * /rooms/{room}:
 *   post:
 *     summary: Add a message to a room.
 *     description: Add a message to a specific room. If the room does not exist, it is created. If the room already has the maximum amount of messages (100), the oldest message is removed.
 *     parameters:
 *       - in: path
 *         name: room
 *         description: The room identifier. If no room is provided, the default room (root) is used.
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Message data to be added to the room.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InMessageDTO'
 *     responses:
 *       '200':
 *         description: Successful response. Returns the updated room info.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OutRoomDTO'
 */
app.post('/rooms/:room?', (req: Request, res: Response) => {
  const inMessageDTO = req.body;
  const { room } = req.params;
  console.log(`Received POST for room '${room}'.`);

  const roomDTO = rooms.addMessage(inMessageDTO, room);
  res.json(roomDTO);
});


app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
