import { Handler, Context } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as serverlessExpress from 'aws-serverless-express';

let cachedServer: Server;
const HOST = process.env.HOST || '*'

async function bootstrap(): Promise<Server> {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

        // Enable CORS
        nestApp.enableCors({
            origin: HOST, // You might want to restrict this in production
            methods: 'GET,POST',
            credentials: true,
        });

        await nestApp.init();
        cachedServer = serverlessExpress.createServer(expressApp);
    }
    return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
    const server = await bootstrap();
    return serverlessExpress.proxy(server, event, context, 'PROMISE').promise;
};