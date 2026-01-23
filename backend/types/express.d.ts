
declare global {
    namespace Express {
        interface Request {
            files?: Multer.File[]
        }
    }
}

export {}


//Почему то не работает, работает только если такую штуку в каждом нужном файле делать