import argon from "argon2";
import generatetoken from "../../../helpers/jwt.js";
import { Tenant, Users } from "../../models/index.js";
import { v1 } from "uuid";

const AuthController = {};

AuthController.Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Comprobar si el usuario existe
        const user = await Users.findOne({ where: { email } });
        // console.log(user.dataValues)
        const usuario = user.dataValues
        if (!usuario || usuario == null) {
            const error = new Error("El Usuario no existe");
            return res.status(404).json({ ok: false, message: error.message });
        }

        // Revisar el password
        if (await argon.verify(usuario.Password, password)) {


            const userInfo = await user.getFK_Usuarios_Info(); // Utiliza el nombre de la relación que has definido en el modelo Users
            //    console.log(userInfo)
            if (userInfo) {
                return res.status(200).json({
                    ok: true,
                    User: { ...user.dataValues, token: generatetoken(user.UserId, user.TenantId), infoId: userInfo, },

                });
            } else {
                return res.status(200).json({
                    ok: true,
                    User: { ...user.dataValues, token: generatetoken(user.UserId, user.TenantId) },

                });
            }
        } else {
            return res.status(404).json({
                ok: false,
                msg: 'Error: Usuario y/o Contraseña Incorrectos'
            })
        }

    } catch (error) {
        return res.status(500).json({ ok: false, error: "Error en el servdor: " + error })
    }
}


AuthController.SingUp = async (req, res) => {
    const { email, password, TenantName } = req.body;
    const exist = await Users.findOne({ where: { Email: email } });
    // console.log(exist.ok)
    if (exist) {
        return res.status(400).json({
            ok: false,
            msg: 'Este Email ya se encuentra registrado en la base de datos'
        });
    }
    const Tenantr = await Tenant.create({ TenantName })
    const userid = v1()
    const user = await Users.create({
        UserId: userid,
        TenantId: Tenantr.TenantId,
        Email: email,
        Password: await argon.hash(password),
        token: await generatetoken(userid, Tenantr.TenantId),
    });
    return res.status(200).json({
        ok: true,
        message: "User account created successfully",
        user,
    });
}
AuthController.RegisterUserByTenant = async (req, res) => {
    const { email, password, TenantId, info } = req.body;
    const exist = await Users.findOne({ where: { Email: email, TenantId: TenantId } });
    // console.log(exist.ok)
    if (exist) {
        return res.status(400).json({
            ok: false,
            msg: 'Este Email ya se encuentra registrado en la base de datos'
        });
    }
    const userid = v1()
    const user = await Users.create({
        UserId: userid,
        TenantId: Tenantr.TenantId,
        Email: email,
        Password: await argon.hash(password),
        token: await generatetoken(userid, Tenantr.TenantId),
    });
    return res.status(200).json({
        ok: true,
        message: "User account created successfully",
        user,
    });
}
AuthController.UpdateProfile = async (req, res) => {
    const { UserId } = req.user; // Asumo que el ID del usuario se obtiene de la solicitud

    try {
        const user = await Users.findByPk(UserId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }

        // Actualiza los campos del perfil según lo que se recibe en req.body
        const updatedUser = await user.update(req.body);

        res.status(200).json({
            ok: true,
            msg: 'Perfil de usuario actualizado correctamente',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error en el servidor: ' + error });
    }
}
AuthController.validarTokenUsuario = async (req, res) => {

    try {


        res.json({
            User: req.user.User,
            token: req.user.User.token,
        })

    } catch (error) {
        return res.status(500).json({ ok: false, error: "Error en el servdor: " + error })

    }


}

// AuthController.googleSignin = async(req, res = response) => {
//     const { id_token } = req.body;

//     try {
//         const { correo, nombre, img } = await googleVerify( id_token );

//         let usuario = await Usuario.findOne({ correo });

//         if ( !usuario ) {
//             // Tengo que crearlo
//             const data = {
//                 nombre,
//                 correo,
//                 password: ':P',
//                 img,
//                 google: true
//             };

//             usuario = new Usuario( data );
//             await usuario.save();
//         }

//         // Si el usuario en DB
//         if ( !usuario.estado ) {
//             return res.status(401).json({
//                 msg: 'Hable con el administrador, usuario bloqueado'
//             });
//         }

//         // Generar el JWT
//         const token = await generarJWT( usuario.id );

//         res.json({
//             usuario,
//             token
//         });

//     } catch (error) {

//         res.status(400).json({
//             msg: 'Token de Google no es válido'
//         })

//     }
// }




AuthController.NewPassword = async (req, res) => {

}

AuthController.UpdatePassword = async (req, res) => {

}

AuthController.forgetPassword = async (req, res) => {

}

AuthController.Confirmed = async (req, res) => {

}




export default AuthController;