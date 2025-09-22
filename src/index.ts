import { createProductManagementController } from './contexts/product-management';
import { createUserManagementController } from './contexts/user-management';
import { WelcomeController } from './contexts/welcome/controllers/welcome.controller';
import { Server } from './shared/server';

const server = new Server();
server.registerController(new WelcomeController());
server.registerController(createProductManagementController());
server.registerController(createUserManagementController());
server.run(3000);
