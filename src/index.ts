import { WelcomeController } from './contexts/welcome/controllers/welcome.controller';
import { Server } from './shared/server';

const server = new Server();
server.registerController(new WelcomeController());
server.run(3000);
