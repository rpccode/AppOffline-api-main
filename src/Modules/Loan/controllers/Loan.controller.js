import Joi from "joi";
import LoanHeader from "../../models/LoanHeader.js";
import { ValidationError } from "sequelize";
import Info from "../../models/Info.js";
import calcularDetallesCuotas from "../helpers/calcularDetallesCuotas.js";
import LoanDetailsController from "./LoanDetails.controller.js";
import LoanDetail from "../../models/LoanDetail.js";

const LoanController = {};

LoanController.GetAllLoanByTenant = async (req, res) => {
    const { TenantIdl } = req.user;
    // console.log(TenantIdl);
    try {
        const loans = await LoanHeader.findAll({ where: { TenantId: TenantIdl } });
        console.log(loans.length);
        if (loans.length === 0) {

            return res.status(400).json({ ok: false, msg: "Noy Prestamos para este tenant" });

        }
        res.status(200).json({
            ok: true,
            loans: loans
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Error en el servidor', msg: error });
    }
}

LoanController.GetOneLoanByTenant = async (req, res) => {
    const { TenantIdl } = req.user;
    const { loanId } = req.params;

    try {
        const loan = await LoanHeader.findOne({ where: { TenantId: TenantIdl, LoanId: loanId } });
        if (!loan) {
            res.status(404).json({ok:false, error: 'Préstamo no encontrado' });
            return;
        }
        res.status(200).json(loan);
    } catch (error) {
        return res.status(500).json({ok:false, error: 'Error en el servidor:'+ error });
    }
}

LoanController.CreateLoan = async (req, res) => {
    const { TenantIdl, UserId } = req.user;
   const User ={
    TenantIdl, 
    UserId
   }
    try {

        // Validar la existencia y el formato de TenantId y UserId
        const userValidationResult = validateUserData(User);

        if (userValidationResult.error) {
            return res.status(400).json({ ok: false, error: userValidationResult.error.message });
        }

        // Validar los datos antes de crear el préstamo
        const validationResult = validateLoanData(req.body);
        if (validationResult.error) {
            return res.status(400).json({ ok: false, error: validationResult.error.message });
        }

         // Verificar si el valor de info_id existe en la tabla Info
         const infoExists = await Info.findByPk(req.body.infoId);
         if (!infoExists) {
             return res.status(400).json({ ok: false, error: 'El valor de info_id no existe en la tabla Info' });
         }
         
        // Crear el préstamo si los datos son válidos
        const newLoan = await LoanHeader.create({
            TenantId: TenantIdl,
            UserId,
            ...req.body
        });

        const {cuotas} = await calcularDetallesCuotas(newLoan);
        // console.log(cuotas)
        if (!cuotas || cuotas.length === 0) {
            return res.status(400).json({ ok: false, error: 'No se generaron cuotas.' });
        }
    
        const result = await LoanDetailsController.CreateDetailsByLoan(cuotas);

        if(!result.ok){
            return res.status(400).json({ ok: false, error:result.error });
        }

        res.status(201).json({
            ok: true,
            Loan: {
                ...newLoan.dataValues,
                    cuotas
            }
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Manejar errores de validación de Sequelize
            return res.status(400).json({ ok: false, error: 'Datos de préstamo no válidos' });
        } else {
            // Manejar otros errores
            return res.status(500).json({ ok: false, error: 'Error en el servidor'+ error });
        }
    }
}
LoanController.CreateLoanByApp = async (req,res) => {
    const listLoanHeader = req.body
    console.log({loan:{...req.body}})
try {

    await LoanHeader.bulkCreate(listLoanHeader)
    res.status(200).json({ok:true, msg:'Prestamos Creados con exito'})
    
} catch (error) {
    res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
}
}

LoanController.CreateDuesByApp = async (req,res) => {
    const listLoanHeader = req.body
    console.log({Dues:{...req.body}})
try {

    await LoanDetail.bulkCreate(listLoanHeader)
    res.status(200).json({ok:true, msg:'Cuotas Creados con exito'})
    
} catch (error) {
    res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
}
}

LoanController.UpdateLoan = async (req, res) => {
    const { TenantIdl } = req.user;
    const { loanId } = req.params;

    try {
        const loan = await LoanHeader.findOne({ where: { TenantId: TenantIdl, LoanId: loanId } });
        if (!loan) {
            return res.status(404).json({ok:false, error: 'Préstamo no encontrado' });

        }
        await loan.update(req.body);
        return res.status(200).json({ok:true,loan});
    } catch (error) {
        return res.status(500).json({ok:false, error: 'Error en el servidor:'+error });
    }
}

LoanController.DeleteLoan = async (req, res) => {
    const { TenantIdl } = req.user;
    const { loanId } = req.params;

    try {
        const loan = await LoanHeader.findOne({ where: { TenantId: TenantIdl, LoanId: loanId } });
        if (!loan) {
            res.status(404).json({ok:false, error: 'Préstamo no encontrado' });
            return;
        }
        await loan.destroy();
      return  res.status(204).end();
    } catch (error) {
      return  res.status(500).json({ok:false, error: 'Error en el servidor:'+ error });
    }
}

// Función de validación de datos de usuario
const validateUserData = (userData) => {
    // Define el esquema de validación con Joi
    const schema = Joi.object({
        TenantIdl: Joi.string().uuid().required(),
        UserId: Joi.string().uuid().required(),
        // Puedes agregar más validaciones según tus necesidades
    });

    // Realiza la validación
    const { error } = schema.validate(userData);

    // Retorna el resultado de la validación
    return { ok: false, error: error ? new Error(error.details.map(detail => detail.message).join('\n')) : null };
}

// Función de validación de datos de préstamo utilizando Joi
const validateLoanData = (loanData) => {
    // Define el esquema de validación con Joi
    const schema = Joi.object({
        infoId: Joi.number().positive().required(),
        FrequencyId: Joi.number().positive().required(),
        Amount: Joi.number().positive().required(),
        Dues: Joi.number().integer().positive().required(),
        Interest: Joi.number().positive().required(),
        Start_date: Joi.date().required(),
        StateId: Joi.number().positive().required()
        // Agrega más validaciones según tus necesidades
    });

    // Realiza la validación
    const { error } = schema.validate(loanData, { abortEarly: false });

    // Retorna el resultado de la validación
    return { ok: false, error: error ? new Error(error.details.map(detail => detail.message).join('\n')) : null };
}






export default LoanController;