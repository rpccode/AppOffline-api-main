import jwt from 'jsonwebtoken'
import { Users } from '../../models/index.js';
import { config } from '../../../config/index.js';


const authenticateMiddleware = async (req, res, next) => {
    try {
        // Obtener el token de la solicitud (generalmente se encuentra en el encabezado Authorization)
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ msg: 'Token de autenticación no proporcionado' });
        }

        // Verificar el token y decodificarlo
        const decodedToken = jwt.verify(token, config.TOKEN_SECRET); // Reemplaza 'JWT_SECRET' con tu secreto de JWT

        // Buscar al usuario en la base de datos por su ID (u otro identificador único)
        const user = await Users.findOne({ where: { UserId: decodedToken.UserId, TenantId: decodedToken.TenantId } })

        if (!user) {
            return res.status(401).json({ msg: 'Token no válido - usuario no existe DB' });
        }
     
        if (!user.state) {
            return res.status(401).json({ msg: 'Token no válido - usuario con estado: false' });
        }

        const userInfo = await user.getFK_Usuarios_Info(); // Utiliza el nombre de la relación que has definido en el modelo Users
        //    console.log(userInfo)
            if(userInfo){
    
                req.user = {
                    User: {...user.dataValues,infoId:userInfo,token},
                    UserId: user.UserId,
                    TenantIdl: decodedToken.TenantId,
                    
                };
            }else{
                req.user = {
                    User: {...user.dataValues,token},
                    UserId: user.UserId,
                    TenantIdl: decodedToken.TenantId,
                    
                };
            }
        // Asignar la información del usuario al objeto de solicitud (req.user)
       

        next(); // Continuar con la ejecución de la ruta
    } catch (error) {
        console.error(error);
        return res.status(401).json({ msg: 'Token de autenticación inválido' });
    }
};

export default authenticateMiddleware;