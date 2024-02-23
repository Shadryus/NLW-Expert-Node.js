import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import {z} from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true }, (connection, request) => {
    // inscrever apenas as msgs publicadas no canal com ID da enquete (`pollID`)
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })
  
    const {pollId} = getPollParams.parse(request.params)
    
    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}

//pattern para lidar com eventos
//Pub/Sub - Publish Subscribers

// "1" => 1, 2, 3, 4, 5,