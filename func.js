function calculate([isHomeless, salary, texExemption, dependents_child,
    dependents_old, dependents_disabled, housingOffer, housingLeaseLoan,
    longTermMortgageLoan, creditCard, checkCardAndCashReceipts, zeroPay,
    transportationCost, traditionalMarket, privatePension, protectionInsurance,
    disabledProtectionInsurance, medicalExpenses, educationalExpenses, monthly]) {
    
    var obj = new Object();
    obj.isHomeless = isHomeless;
    obj.salary = salary;
    obj.texExemption = texExemption;
    obj.dependents_child = dependents_child;
    obj.dependents_old = dependents_old;
    obj.dependents_disabled = dependents_disabled;
    obj.housingOffer = housingOffer;
    obj.housingLeaseLoan = housingLeaseLoan;
    obj.longTermMortgageLoan = obj.longTermMortgageLoan;
    obj.creditCard = obj.creditCard;
    obj.checkCardAndCashReceipts = checkCardAndCashReceipts;
    obj.zeroPay = zeroPay;
    obj.transportationCost = transportationCost;
    obj.traditionalMarket = traditionalMarket;
    obj.privatePension = privatePension;
    obj.protectionInsurance = protectionInsurance;
    obj.disabledProtectionInsurance = disabledProtectionInsurance;
    obj.medicalExpenses = medicalExpenses;
    obj.educationalExpenses = educationalExpenses;
    obj.monthly = monthly;
    
    return JSON.stringify(obj);
}

exports.calculate = calculate;