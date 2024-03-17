function calcularFechaCuota(start_date, cuotaNumero, frequency, diaPago) {
    const startDate = new Date(start_date);
    let fechaCuota;

    switch (frequency) {
        case 1: // Weekly
            fechaCuota = new Date(startDate.getTime() + cuotaNumero * 7 * 24 * 60 * 60 * 1000);
            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            }
            break;
        case 2: // Bi-Weekly
            fechaCuota = new Date(startDate.getTime() + cuotaNumero * 14 * 24 * 60 * 60 * 1000);
            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            }
            break;
        case 3: // Monthly
            fechaCuota = new Date(startDate.getFullYear(), startDate.getMonth() + cuotaNumero, startDate.getDate());
            // Calcular el nuevo mes y año por separado
            const nuevoMes = startDate.getMonth() + cuotaNumero;
            const nuevoAno = startDate.getFullYear() + Math.floor(nuevoMes / 12);
            const mesAjustado = nuevoMes % 12;

            fechaCuota.setMonth(mesAjustado);
            fechaCuota.setFullYear(nuevoAno);

            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            } else {
                // Ajustar para asegurarse de que no sea posterior al último día del mes
                fechaCuota.setDate(Math.min(startDate.getDate(), new Date(fechaCuota.getFullYear(), fechaCuota.getMonth() + 1, 0).getDate()));

            }


            break;
        case 4: // Quarterly
            fechaCuota = new Date(startDate.getFullYear(), startDate.getMonth() + cuotaNumero * 3, startDate.getDate());
            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            }
            break;
        case 5: // Semi-Annually
            fechaCuota = new Date(startDate.getFullYear(), startDate.getMonth() + cuotaNumero * 6, startDate.getDate());
            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            }
            break;
        case 6: // Annually
            fechaCuota = new Date(startDate.getFullYear() + cuotaNumero, startDate.getMonth(), startDate.getDate());
            // Establecer el día de pago si se proporciona
            if (diaPago !== undefined && diaPago >= 1 && diaPago <= 31) {
                fechaCuota.setDate(diaPago);
            }
            break;
        default:
            throw new Error('Frecuencia no válida');
    }

    return fechaCuota.toISOString().split('T')[0];
}

export default calcularFechaCuota;