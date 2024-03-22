import { sequelizeInstance } from "../../../config/index.js";
import { LoanDetail } from "../../models/index.js";

const LoanDetailsController = {};

LoanDetailsController.CreateDetailsByLoan = async(req,res) =>{
    const cuotas = req.body
    const t = await sequelizeInstance.transaction();
        try {

            await LoanDetail.bulkCreate(cuotas,{ transaction: t })

            
            await t.commit();
            return {
                ok:true,
                msg:'Inserciones exitosa'
            }
        } catch (error) {
            await t.rollback();
            return { ok:false , error:'Error en el servidor: '+ error}
        }
}

LoanDetailsController.CreateDetailsByLoan = async(cuotas) =>{
    const t = await sequelizeInstance.transaction();
        try {

            await LoanDetail.bulkCreate(cuotas,{ transaction: t })

            
            await t.commit();
            return {
                ok:true,
                msg:'Inserciones exitosa'
            }
        } catch (error) {
            await t.rollback();
            return { ok:false , error:'Error en el servidor: '+ error}
        }
}
LoanDetailsController.GetDuesByAllLoan = async (req,res) =>{
    const { TenantIdl } = req.user;
    // console.log(TenantIdl);
    try {
        const dues = await LoanDetail.findAll({ where: { TenantId: TenantIdl } });
        console.log(dues.length);
        if (dues.length === 0) {

            return res.status(400).json({ ok: false, msg: "No hay cuotas para este tenant" });

        }
        res.status(200).json({
            ok: true,
            dues: dues
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: 'Error en el servidor', msg: error });
    }
}


export default LoanDetailsController