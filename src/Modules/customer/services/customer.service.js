import CustomerController from "../controller/customer.controller.js";

const CustomerService = {};


CustomerService.CreateCustomerByApp =async () =>{
    return await CustomerController.CreateByAppCustomer(req,res)
}


CustomerService.PostCustomer = async (req, res) => {
    return await CustomerController.CreateCustomer(req, res)
}
CustomerService.GetCustomerByTenant = async (req, res) => {
    return await CustomerController.GetAllCustomer(req, res)
}


CustomerService.GetCustomerReleased= async (req, res) => {
    return await CustomerController.GetCustomerReleased(req, res)
}


CustomerService.GetCustomerNotReleased= async (req, res) => {
    return await CustomerController.GetCustomerNotReleased(req, res)
}


CustomerService.GetCustomersWithOverdueDues= async (req, res) => {
    return await CustomerController.GetCustomersWithOverdueDues(req, res)
}







export default CustomerService;