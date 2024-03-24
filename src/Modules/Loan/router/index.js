// src/Routers/index.js
import { Router } from 'express';
import LoanService from '../services/Loan.service.js';
// import CustomerService from '../services/customer.service.js';
import authenticateMiddleware from '../../auth/middleware/auth.middleware.js';


const router = Router();

router.get('/', authenticateMiddleware, LoanService.GetAllLoanByTenant)
router.get('/dues', authenticateMiddleware, LoanService.GetDuesByAllLoan)
router.get('/:loanId', authenticateMiddleware, LoanService.GetOneLoanByTenant)
router.post('/', authenticateMiddleware, LoanService.CreateLoan)
router.post('/loandetail', authenticateMiddleware, LoanService.LoadeDuesByApp)
router.post('/loanheader', authenticateMiddleware, LoanService.LoadeLoanByApp)
router.put('/:loanId', authenticateMiddleware, LoanService.UpdateLoan)
router.delete('/:loanId', authenticateMiddleware, LoanService.DelecteLoan)



// router.get('/', authenticateMiddleware, CustomerService.GetCustomerByTenant)
// router.post('/', authenticateMiddleware, CustomerService.PostCustomer)

// router.get('/seed/tenant', insertTenants)

export default router;