import { Router } from 'express';
// Import controller functions
import { signup, login } from '../controllers/auth.controller'; // Import signup and login

const router = Router();

// Define authentication routes
router.post('/signup', signup); // Use the imported signup controller
router.post('/login', login); // Use the imported login controller

export default router; 