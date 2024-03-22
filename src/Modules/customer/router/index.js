// src/Routers/index.js
import { Router } from 'express';
import CustomerService from '../services/customer.service.js';
import authenticateMiddleware from '../../auth/middleware/auth.middleware.js';


const router = Router();

// Define your routes here
router.get('/', authenticateMiddleware, CustomerService.GetCustomerByTenant)
router.get('/released', authenticateMiddleware, CustomerService.GetCustomerReleased)
router.get('/loan', authenticateMiddleware, CustomerService.GetCustomerNotReleased)
router.get('/dues', authenticateMiddleware, CustomerService.GetCustomersWithOverdueDues)


router.post('/', authenticateMiddleware, CustomerService.PostCustomer)
router.post('/customer', authenticateMiddleware, CustomerService.CreateCustomerByApp)


// router.get('/seed/tenant', insertTenants)

export default router;