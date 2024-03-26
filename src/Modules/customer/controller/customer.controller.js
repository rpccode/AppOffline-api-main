import { Info, LoanDetail, LoanHeader } from "../../models/index.js";

const CustomerController = {};

CustomerController.CreateByAppCustomer = async (req,res) => {
        const listCustomers = req.body
        console.log({customer:req.body})
    try {

       const result = await Info.bulkCreate(listCustomers)
       console.log(result)
        res.status(200).json({ok:true, msg:'Clientes Creados con exito'})
        
    } catch (error) {
        res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
    }
}

CustomerController.CreateCustomer = async (req, res) => {

    const { TenantIdl, UserId } = req.user
    try {

        const customer = await Info.create({
            TenantId: TenantIdl,
            ...req.body
        })

        return res.status(200).json({
            ok: true,
            msg: 'Informacion a sido registrada correctamente ',
            customer
        })

    } catch (error) {
        res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
    }
}

CustomerController.GetAllCustomer = async (req, res) => {
    const TenantIdl = req.user.TenantIdl
    // console.log(TenantIdl);
    // console.log(req);
    try {
        const AllCustomer = await Info.findAll({ where: { TenantId: TenantIdl } })


        res.status(200).json({ok:true, customers:AllCustomer})
    } catch (error) {
        res.status(500).json('Error en el Servidor:' + error)
    }
}

CustomerController.GetOneCustomer = async (req, res) => {
    const { TenantIdl } = req.user;
    const customerId = req.params.customerId; // Asumo que el customerId se pasa como parámetro en la ruta

    try {
        const customer = await Info.findOne({ where: { TenantId: TenantIdl, id: customerId } });

        if (!customer) {
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no encontrado',
            });
        }

        res.status(200).json({
            ok: true,
            customer,
        });
    } catch (error) {
        res.status(500).json('Error en el Servidor: ' + error);
    }
};

 
CustomerController.GetCustomerReleased =async (req,res) => {
    const TenantIdl = req.user.TenantIdl
    // console.log(TenantIdl);
    // console.log(req);
    try {
        const AllCustomer = await Info.findAll({ where: { TenantId: TenantIdl },
            include: [
            {
                model: LoanHeader,
                as: 'LoanHeaderInfo',
                required: false, // Esto hace que sea una LEFT JOIN para obtener todos los clientes incluso si no tienen préstamo
            }
        ] })

        // Filtrar solo los clientes que no tienen préstamos
        const customersWithoutLoans = AllCustomer.filter(customer => !customer.LoanHeaderInfo);
        // Remover la propiedad LoanHeaderInfo con valor null de la data
        const cleanedData = customersWithoutLoans.map(customer => {
            const plainCustomer = customer.toJSON();
            if (!plainCustomer.LoanHeaderInfo) {
                delete plainCustomer.LoanHeaderInfo;
            }
            return plainCustomer;
        });
   
      
       return res.status(200).json({ok:true,Released:cleanedData})
    } catch (error) {
       return res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
    }
}

CustomerController.GetCustomerNotReleased =async (req,res) => {
    const TenantIdl = req.user.TenantIdl
    // console.log(TenantIdl);
    // console.log(req);
    try {
        const AllCustomer = await Info.findAll({ where: { TenantId: TenantIdl },
            include: [
            {
                model: LoanHeader,
                as: 'LoanHeaderInfo',
                required: true, // Esto hace que sea una LEFT JOIN para obtener todos los clientes incluso si no tienen préstamo
            }
        ] })

      // Agrupar clientes por InfoId y obtener todos sus préstamos
      const groupedCustomers = AllCustomer.reduce((result, customer) => {
        if (!result[customer.InfoId]) {
            result[customer.InfoId] = { ...customer.toJSON(), LoanHeaderInfo: [] };
        }
        if (customer.LoanHeaderInfo) {
            result[customer.InfoId].LoanHeaderInfo.push(customer.LoanHeaderInfo);
        }
        return result;
    }, {});

    const uniqueCustomers = Object.values(groupedCustomers);
      
       return res.status(200).json({ok:true,Released:uniqueCustomers })
    } catch (error) {
       return res.status(500).json({ok:false, error:'Error en el Servidor:' + error})
    }
}

CustomerController.GetCustomersWithOverdueDues = async (req, res) => {
    const TenantId = req.user.TenantId;
    try {
        const customersWithOverdueDues = await Info.findAll({
            where: { TenantId },
            include: [
                {
                    model: LoanHeader,
                    as: 'LoanHeaderInfo',
                    // Para asegurar que solo se devuelvan los clientes con préstamos activos
                    include: [
                        {
                            model: LoanDetail,
                            as: 'LoanDetails',
                           // Para asegurar que solo se devuelvan los préstamos con cuotas
                            where: {
                                StateId: 2, // Estado 2 indica cuotas vencidas o para pagar, ajusta según tus necesidades
                            }
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ success: true, customers: customersWithOverdueDues });
    } catch (error) {
        console.error('Error fetching customers with overdue dues:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
};

CustomerController.GetPayByCustomer = async (req, res) => {
    const { TenantIdl } = req.user;
    const customerId = req.params.customerId; // Asumo que el customerId se pasa como parámetro en la ruta

    try {
        const payments = await Info.findAll({
            attributes: ['paymentMethod', 'amount'], // Ajusta los atributos según tu modelo
            where: { TenantId: TenantIdl, id: customerId },
        });

        if (!payments || payments.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron pagos para el cliente',
            });
        }

        return  res.status(200).json({
            ok: true,
            payments,
        });
    } catch (error) {
       return res.status(500).json({ok:true,error:'Error en el Servidor: ' + error});
    }
};

CustomerController.UpdateCustomer = async (req, res) => {
    const { TenantIdl } = req.user;
    const customerId = req.params.customerId;

    try {
        const { DNI } = req.body;
        const existingCustomer = await Info.findOne({ where: { TenantId: TenantIdl, DNI } });

        if (existingCustomer && existingCustomer.InfoId !== customerId) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un cliente con el mismo DNI para este TenantId',
            });
        }

        const [updatedRows] = await Info.update(req.body, {
            where: { TenantId: TenantIdl, InfoId: customerId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no encontrado o no se realizaron cambios',
            });
        }

        const updatedCustomer = await Info.findOne({ where: { TenantId: TenantIdl, InfoId: customerId } });

       return res.status(200).json({
            ok: true,
            msg: 'Cliente actualizado correctamente',
            customer: updatedCustomer,
        });
    } catch (error) {
       return res.status(500).json({ok:true, error:'Error en el Servidor: ' + error});
    }
};

CustomerController.DeleteCustomer = async (req, res) => {
    const { TenantIdl } = req.user;
    const customerId = req.params.customerId;

    try {
        const deletedRows = await Info.destroy({ where: { TenantId: TenantIdl, InfoId: customerId } });

        if (deletedRows === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Cliente no encontrado o no se realizó la eliminación',
            });
        }

       return res.status(200).json({
            ok: true,
            msg: 'Cliente eliminado correctamente',
        });
    } catch (error) {
       return res.status(500).json({ok:true, error: 'Error en el Servidor: ' + error});
    }
};
export default CustomerController