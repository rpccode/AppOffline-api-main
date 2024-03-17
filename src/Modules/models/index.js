import sequelizeInstance from "../../config/sequelize.config.js"
import Address from "./Address.js"
import Barrio from "./Barrio.js"
import Ciudad from "./Ciudad.js"
import Info from "./Info.js"
import Users from "./Users.js"
import Frequency from "./Frequency.js"
import LoanDetail from "./LoanDetail.js"
import LoanHeader from "./LoanHeader.js"
import LoanState from "./LoanState.js"
import MARegion from "./MARegion.js"
import MIRegion from "./MIRegion.js"
import Pais from "./Pais.js"
import Payment from "./Payment.js"
import Provincia from "./Provincia.js"
import Sector from "./Sector.js"
import Tenant from "./Tenant.js"
import UserType from "./UserType.js"


const conectardb = async () => {
    try {
        await sequelizeInstance.sync({ force: false })
            .then(async () => {
                console.log('Connection to db has been succesful')
            })
            .catch(err => console.error(err))
    } catch (error) {
        console.log(error)
    }
}



export {
    conectardb,
    LoanState,
    Tenant,
    Address,
    Barrio,
    Ciudad,
    Provincia,
    Sector,
    Pais,
    Payment,
    Users,
    Info,
    LoanDetail,
    LoanHeader,
    MARegion,
    MIRegion,
    Frequency,
    UserType,

}