// src/Routers/index.js
import { Router } from 'express';
import { check } from 'express-validator';
import { Login, SingUp,validarTokenUsuario } from '../services/Auth.service.js';
import validarCampos from '../../../middleware/validar-campos.js';
import authenticateMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Define your routes here
router.post('/',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], Login)
router.post('/register', SingUp)

router.get('/',authenticateMiddleware,validarTokenUsuario)

// router.post('/google',[
//     check('id_token', 'El id_token es necesario').not().isEmpty(),
//     validarCampos
// ], googleSignin );
// // router.get('/seed/tenant', insertTenants)

export default router;