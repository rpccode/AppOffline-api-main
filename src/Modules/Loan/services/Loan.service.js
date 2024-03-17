import LoanController from "../controllers/Loan.controller.js";
import LoanDetailsController from "../controllers/LoanDetails.controller.js";

const LoanService = {};

LoanService.GetAllLoanByTenant = async (req, res) => {
    return await LoanController.GetAllLoanByTenant(req, res);
}

LoanService.GetOneLoanByTenant = async (req, res) => {
    return await LoanController.GetOneLoanByTenant(req, res)
}

LoanService.CreateLoan = async (req, res) => {
    return await LoanController.CreateLoan(req, res)
}

LoanService.UpdateLoan = async (req, res) => {
    return await LoanController.UpdateLoan(req, res);
}
LoanService.DelecteLoan = async (req, res) => {
    return await LoanController.DelecteLoan(req, res);

}

LoanService.GetDuesByAllLoan = async (req, res) => {
    return await LoanDetailsController.GetDuesByAllLoan(req, res);

}






export default LoanService;