// src/Routers/index.js
import { Router } from 'express';
import { insertTenants } from '../DB/seed/tenan.data.js';
import { Information, insertData } from '../DB/seed/InsertData.js';
import authRouter from '../Modules/auth/routers/index.js'
import customerRouter from '../Modules/customer/router/index.js'
import loanRouter from '../Modules/Loan/router/index.js'
const router = Router();

router.use('/auth', authRouter)
router.use('/customer', customerRouter)
router.use('/loans', loanRouter)
router.use('/loanheader', loanRouter)
router.use('/loandetail', loanRouter)



// Define your routes here
router.get('/seed', insertData)
router.get('/seed/tenant', insertTenants)
router.get('/informacion', Information)

export default router;