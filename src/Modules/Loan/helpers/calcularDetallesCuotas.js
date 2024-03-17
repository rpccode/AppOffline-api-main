import calcularFechaCuota from "./calcularFechaCuota.js";

async function calcularDetallesCuotas(loanHeader,diaPago) {

    const {
        LoanId,
        TenantId,
        FrequencyId,
        Dues,
        Interest,
        Amount,
        Start_date,
        StateId
    } = loanHeader;

    // Arreglo para almacenar los detalles de las cuotas
    const cuotas = [];
    let payTotalAmount = 0;
    let payTotalInterest = 0;
    let payDuesAmount = 0;

    // Calcular los valores necesarios para cada cuota
    for (let cuotaNumero = 1; cuotaNumero <= Dues; cuotaNumero++) {
        let duesAmount = Math.floor(Amount / Dues); // Redondear hacia abajo el monto de cada cuota
        const totalInterest = Math.floor((Amount * Interest) / 100); // Redondear hacia abajo el total de interés por cuota
        let totalAmount = duesAmount + totalInterest; // Monto total por cuota

        // Ajustar el último pago para igualar el monto original del préstamo
        if (cuotaNumero === Dues) {
            const amountRemaining = Amount - payDuesAmount - duesAmount
           
            duesAmount += amountRemaining
        }

        // Crear objeto con los valores calculados
        const loanDetailValues = {
            LoanId,
            TenantId,
            Dues_num: cuotaNumero,
            Dues_amount: duesAmount,
            Total_amount: totalAmount,
            Total_interest: totalInterest,
            Start_date: await calcularFechaCuota(Start_date, cuotaNumero, FrequencyId,diaPago),
            StateId,
        };

        payTotalAmount += duesAmount;
        payTotalInterest += totalInterest;
        payDuesAmount += duesAmount;

        // Agregar el detalle de la cuota al arreglo
        cuotas.push(loanDetailValues);
    }

    return {
        cuotas,
        payTotalAmount,
        payTotalInterest,
        payDuesAmount
    };
}

export default calcularDetallesCuotas