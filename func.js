function calculate([isHomeless, salary, texExemption, workingMonths, dependents, dependents_child,
    dependents_old, dependents_disabled, housingOffer, housingLeaseLoan,
    longTermMortgageLoan, creditCard, checkCardAndCashReceipts, zeroPay,
    transportationCost, traditionalMarket, privatePension, protectionInsurance,
    disabledProtectionInsurance, medicalExpenses, educationalExpenses, monthly], idx) {
    
    var obj = new Object();
    obj.isHomeless = isHomeless;
    obj.salary = salary;
    obj.texExemption = texExemption;
    obj.workingMonths = workingMonths;
    obj.dependents = dependents;
    obj.dependents_child = dependents_child;
    obj.dependents_old = dependents_old;
    obj.dependents_disabled = dependents_disabled;
    obj.housingOffer = housingOffer;
    obj.housingLeaseLoan = housingLeaseLoan;
    obj.longTermMortgageLoan = longTermMortgageLoan;
    obj.creditCard = creditCard;
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

    var table = make_table(obj);
    var obj_return;
    switch (idx) {
        case 0:
            obj_return = get_aptApp(obj, table);
            break;
        case 1:
            obj_return = get_creditCard(obj, table);
            break;
        case 2:
            obj_return = get_insurance(obj, table);
            break;
        case 3:
            obj_return = get_privatePension(obj, table);
            break;
        case 4:
            obj_return = get_medical(obj, table);
            break;
        case 5:
            obj_return = get_common(obj, table);
            break;
    }

    return obj_return;
}

/* 주택청약 계산 */
function get_aptApp(obj, table) {
    
    var obj_aptApp = new Object();

    /* 1. 주택청약 */
    var additionalSave = 0;     // 주택청약추가적립금액
    var additionalTaxReduction = 0;     // 주택청약추가세액공제

    if (obj.salary <= 70000000 && obj.isHomeless) {
        additionalSave = 2400000 - obj.housingOffer;
        var tp = table.totalIncome - additionalSave;
        var tp2 = 0;
        var calTaxAmount = 0;
        if (tp > 500000000) {
            tp2 = 174600000 + (tp - 500000000) * 0.42;
        } else if (tp > 300000000) {
            tp2 = 9460000 + (tp - 300000000) * 0.4;
        } else if (tp > 150000000) {
            tp2 = 37600000 + (tp - 1500000000) * 0.38;
        } else if (tp > 88000000) {
            tp2 = 15500000 + (tp - 88000000) * 0.35;
        } else if (tp > 46000000) {
            tp2 = 5820000 + (tp - 46000000) * 0.24;
        } else if (tp > 12000000) {
            tp2 = 720000 + (tp - 12000000) * 0.15;
        } else {
            tp2 = tp * 0.06;
        }
        additionalTaxReduction = table.calTaxAmount - tp2;
    }

    /* 2. 주택자금소득공제 */
    var redemption = 0;     // 임차차입금
    var redemptionRate = 0;     // 임차차입금세율


    /* 추후 계산할 것 */
    
    
    /* 3. 장기주택 저당차입금 이자상환액 */
    var interestPaymentRate = table.calTaxRate * 1.1;    // 이자상환액
    var maximumInterest = 0;        // 이자한도 - 추후에 3가지 옵션을 곁들여서 해줘야 함.


    /* 추후 계산할 것 */


    /* 4. 월세세액공제 */
    var rentReductionRate = 0;
    if (obj.salary <= 70000000 && obj.isHomeless) {
        rentReductionRate = (obj.salary > 55000000) ? 0.132 : 0.11;
    } 

    /* OBJECT 정리 */
    obj_aptApp.additionalSave = additionalSave;
    obj_aptApp.additionalTaxReduction = additionalTaxReduction;
    obj_aptApp.redemption = redemption;
    obj_aptApp.redemptionRate = redemptionRate;
    obj_aptApp.interestPaymentRate = interestPaymentRate;
    obj_aptApp.maximumInterest = maximumInterest;
    obj_aptApp.rentReductionRate = rentReductionRate;

    return obj_aptApp;

}

/* 신용카드 계산 */
function get_creditCard(obj, table) {

    var obj_creditCard = new Object();

    var maxValue = 0;
    if (obj.salary > 120000000) {
        maxValue = 2000000;
    } else if (obj.salary > 70000000) {
        maxValue = 2500000;
    } else {
        maxValue = 3000000;
    }

    var val = maxValue - table.totalIncomeDeduction_expenditure;
    val = (val < 0) ? 0 : val;

    /* 추가 소비에 따른 환급분 */
    var creditExpenditure_additional = val / 0.15;     // 신용카드 추가지출
    var checkExpenditure_additional = val / 0.3;       // 체크카드 추가지출
    var zeroPayExpenditure_additional = val / 0.4;     // 제로페이 추가지출
    var taxRefund = 0;                      // 세금 환급
    tp = table.totalTaxBase - val;

    tp2 = 0;
    if (tp > 500000000) {
        tp2 = 174600000 + (tp - 500000000) * 0.42;
    } else if (tp > 300000000) {
        tp2 = 9460000 + (tp - 300000000) * 0.4;
    } else if (tp > 150000000) {
        tp2 = 37600000 + (tp - 1500000000) * 0.38;
    } else if (tp > 88000000) {
        tp2 = 15500000 + (tp - 88000000) * 0.35;
    } else if (tp > 46000000) {
        tp2 = 5820000 + (tp - 46000000) * 0.24;
    } else if (tp > 12000000) {
        tp2 = 720000 + (tp - 12000000) * 0.15;
    } else {
        tp2 = tp * 0.06;
    }

    taxRefund = table.calTaxAmount - tp2;

    /* 총 소비에 따른 환급분 */
    var min_expenditure_value = obj.salary * 0.25;      // 소비 기준(체크, 신용)
    var creditExpenditure_total = min_expenditure_value + (maxValue / 0.15);       // 신용카드 총 지출분
    var creditTaxRefundRate = table.calTaxRate * 0.15 * 1.1;        // 신용카드 환급율

    var checkExpenditure_total = min_expenditure_value + (maxValue / 0.3);      // 체크카드 총 지출분
    var checkTaxRefundRate = table.calTaxRate * 0.3 * 1.1;      // 체크카드 환급율

    var creditSuggestion = min_expenditure_value;       // 신용카드 추천 지출
    var checkSuggestion = checkExpenditure_total - min_expenditure_value;       // 체크카드 추천 지출

    obj_creditCard.creditExpenditure_additional = creditExpenditure_additional;
    obj_creditCard.checkExpenditure_additional = checkExpenditure_additional;
    obj_creditCard.zeroPayExpenditure_additional = zeroPayExpenditure_additional;
    obj_creditCard.taxRefund = taxRefund;
    obj_creditCard.min_expenditure_value = min_expenditure_value;
    obj_creditCard.creditExpenditure_total = creditExpenditure_total;
    obj_creditCard.creditTaxRefundRate = creditTaxRefundRate;
    obj_creditCard.checkExpenditure_total = checkExpenditure_total;
    obj_creditCard.checkTaxRefundRate = checkTaxRefundRate;
    obj_creditCard.creditSuggestion = creditSuggestion;
    obj_creditCard.checkSuggestion = checkSuggestion;

    return obj_creditCard;

}

/* 보험료 세액공제 계산 */
function get_insurance(obj, table) {

    var obj_insurance = new Object();

    var insurancePayment_additional = 1000000 - obj.protectionInsurance;        // 추가 보험 지급액
    insurancePayment_additional = (insurancePayment_additional < 0) ? 0 : insurancePayment_additional;
    var insuranceTaxRefund_additional = insurancePayment_additional * 0.132;    // 추가 보험 세액공제

    obj_insurance.insurancePayment_additional = insurancePayment_additional;
    obj_insurance.insuranceTaxRefund_additional = insuranceTaxRefund_additional;

    return obj_insurance;

}

/* 사적연금 계산 */
function get_privatePension(obj, table) {
    
    var obj_privatePension = new Object();

    var maxVal = (obj.salary > 120000000) ? 3000000 : 4000000;

    var privatePension_additional = maxVal - obj.privatePension;        // 사적연금 추가 납부액
    privatePension_additional = (privatePension_additional < 0) ? 0 : privatePension_additional;

    var rate_multi = (obj.salary > 55000000) ? 0.12 : 0.15;

    var privatePensionTaxRefund_additional = privatePension_additional * rate_multi * 1.1;      // 사적연금 세액 공제

    obj_privatePension.privatePension_additional = privatePension_additional;
    obj_privatePension.privatePensionTaxRefund_additional = privatePensionTaxRefund_additional;

    return obj_privatePension;

}

/* 의료비 계산 */
function get_medical(obj, table) {
    
    var obj_medical = new Object();

    var minimumMedicalExpense = obj.salary * 0.03;  // 의료비 최소 지출액.

    obj_medical.minimumMedicalExpense = minimumMedicalExpense;

    return obj_medical;

}

/* 공통 계산 */
function get_common(obj, table) {
    
    var obj_common = new Object();

    /* 자녀 세액 공제 */
    var deductionChild_annual = (obj.dependents_child < 2) ? 150000 : 300000;       // 출산 시 매년 공제액
    var deductionChild_first = 0;           // 출산 년도 공제액
    if (obj.dependents_child == 0) {
        deductionChild_first = 300000;
    } else if (obj.dependents_child == 1) {
        deductionChild_first = 500000;
    } else {
        deductionChild_first = 700000;
    }

    obj_common.deductionChild_annual = deductionChild_annual;
    obj_common.deductionChild_first = deductionChild_first;

    return obj_common;

}

function get_table([isHomeless, salary, texExemption, workingMonths, dependents, dependents_child,
    dependents_old, dependents_disabled, housingOffer, housingLeaseLoan,
    longTermMortgageLoan, creditCard, checkCardAndCashReceipts, zeroPay,
    transportationCost, traditionalMarket, privatePension, protectionInsurance,
    disabledProtectionInsurance, medicalExpenses, educationalExpenses, monthly]) {
    
    var obj = new Object();
    obj.isHomeless = isHomeless;
    obj.salary = salary;
    obj.texExemption = texExemption;
    obj.workingMonths = workingMonths;
    obj.dependents = dependents;
    obj.dependents_child = dependents_child;
    obj.dependents_old = dependents_old;
    obj.dependents_disabled = dependents_disabled;
    obj.housingOffer = housingOffer;
    obj.housingLeaseLoan = housingLeaseLoan;
    obj.longTermMortgageLoan = longTermMortgageLoan;
    obj.creditCard = creditCard;
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

    return make_table(obj);
    
}

/* 주택청약 계산 */
function make_table(obj) {

    var table = new Object();
     
    if (obj.texExemption == 0) {
        obj.texExemption = 100000 * obj.workingMonths;
    }

    /* 근로소득공제 계산 */
    var earnedIncomeDeduction = 0;
    if (obj.salary > 100000000) {
        earnedIncomeDeduction = 14750000 + (obj.salary - 100000000) * 0.02;
    } else if (obj.salary > 45000000) {
        earnedIncomeDeduction = 12000000 + (obj.salary - 45000000) * 0.05;
    } else if (obj.salary > 15000000) {
        earnedIncomeDeduction = 7500000 + (obj.salary - 15000000) * 0.15;
    } else if (obj.salary > 5000000) {
        earnedIncomeDeduction = 3500000 + (obj.salary - 5000000) * 0.4;
    } else {
        earnedIncomeDeduction = obj.salary * 0.7;
    }
    /* -------------------------------------------- */
    
    /* 종합소득금액 */
    var totalIncome = obj.salary - earnedIncomeDeduction - obj.texExemption;

    /* 종합소득공제 - 기본공제 */
    var totalIncomeDeduction_basic = 0;
    totalIncomeDeduction_basic += obj.dependents * 1500000;
    totalIncomeDeduction_basic += obj.dependents_disabled * 2000000;
    totalIncomeDeduction_basic += obj.dependents_old * 1000000;

    /* 종합소득공제 - 연금공제 */
    var totalIncomeDeduction_pension = 0;
    var monthlyWage = obj.salary / obj.workingMonths;
    monthlyWage = (monthlyWage < 300000) ? 300000 : monthlyWage;
    monthlyWage = (monthlyWage > 4680000) ? 4680000 : monthlyWage;
    totalIncomeDeduction_pension = monthlyWage * 0.045 * obj.workingMonths;

    /* 종합소득공제 - 보험료소득공제 */
    var totalIncomeDeduction_insurance = 0;
    monthlyWage = obj.salary / obj.workingMonths;
    monthlyWage = (monthlyWage < 280000) ? 280000 : monthlyWage;
    monthlyWage = (monthlyWage > 78100000) ? 78100000 : monthlyWage;
    var insurance_health = monthlyWage * 0.0323 * obj.workingMonths;
    var insurance_employment = obj.salary * 0.0065;
    totalIncomeDeduction_insurance = insurance_health + insurance_employment;

    /* 종합소득공제 - 주택청약 */
    var totalIncomDeduction_aptApp = 0;
    if (obj.salary <= 70000000 && obj.isHomeless) {
        totalIncomDeduction_aptApp = Math.min(2400000, obj.housingOffer) * 0.4;
    }

    /* 종합소득공제 - 신용카드 등 */
    var totalIncomeDeduction_expenditure = 0;
    var min_expenditure_value = obj.salary * 0.25;
    
    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);

    var nCreditCard = (obj.creditCard < min_expenditure_value) ? 0 : obj.creditCard - min_expenditure_value;
    min_expenditure_value = (min_expenditure_value < obj.creditCard) ? 0 : min_expenditure_value - obj.creditCard;
    totalIncomeDeduction_expenditure += nCreditCard * 0.15;

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);
    
    var nCheckCard = (obj.checkCardAndCashReceipts < min_expenditure_value) ? 0 : obj.checkCardAndCashReceipts - min_expenditure_value;   // 체크카드, 현금영수증
    min_expenditure_value = (min_expenditure_value < obj.checkCardAndCashReceipts) ? 0 : min_expenditure_value - obj.checkCardAndCashReceipts;
    totalIncomeDeduction_expenditure += nCheckCard * 0.3;

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);
    
    var nZeroPay = (obj.zeroPay < min_expenditure_value) ? 0 : obj.zeroPay - min_expenditure_value;      //제로페이
    min_expenditure_value = (min_expenditure_value < obj.zeroPay) ? 0 : min_expenditure_value - obj.zeroPay;
    totalIncomeDeduction_expenditure += nZeroPay * 0.4;

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);

    var nTransportationCost = (obj.transportationCost < min_expenditure_value) ? 0 : obj.transportationCost - min_expenditure_value;    // 교통비
    min_expenditure_value = (min_expenditure_value < obj.transportationCost) ? 0 : min_expenditure_value - obj.transportationCost;
    totalIncomeDeduction_expenditure += nTransportationCost * 0.4;

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);

    var nTraditionalMarket = (obj.traditionalMarket < min_expenditure_value) ? 0 : obj.traditionalMarket - min_expenditure_value;      // 전통시장
    min_expenditure_value = (min_expenditure_value < obj.traditionalMarket) ? 0 : min_expenditure_value - obj.traditionalMarket;
    totalIncomeDeduction_expenditure += nTraditionalMarket * 0.4;

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);

    var maxValue = 0;
    if (obj.salary > 120000000) {
        maxValue = 2000000;
    } else if (obj.salary > 70000000) {
        maxValue = 2500000;
    } else {
        maxValue = 3000000;
    }

    console.log(obj.salary + " / " + maxValue);

    totalIncomeDeduction_expenditure = Math.min(totalIncomeDeduction_expenditure, maxValue);

    console.log(totalIncomeDeduction_expenditure + " / " + min_expenditure_value);

    /* 종합과세표준 */
    var totalTaxBase = totalIncome - totalIncomeDeduction_basic - totalIncomeDeduction_pension
        - totalIncomeDeduction_insurance - totalIncomDeduction_aptApp - totalIncomeDeduction_expenditure;

    /* 산출세액 */
    var calTaxAmount = 0;
    if (totalTaxBase > 500000000) {
        calTaxAmount = 174600000 + (totalTaxBase - 500000000) * 0.42;
    } else if (totalTaxBase > 300000000) {
        calTaxAmount = 9460000 + (totalTaxBase - 300000000) * 0.4;
    } else if (totalTaxBase > 150000000) {
        calTaxAmount = 37600000 + (totalTaxBase - 1500000000) * 0.38;
    } else if (totalTaxBase > 88000000) {
        calTaxAmount = 15500000 + (totalTaxBase - 88000000) * 0.35;
    } else if (totalTaxBase > 46000000) {
        calTaxAmount = 5820000 + (totalTaxBase - 46000000) * 0.24;
    } else if (totalTaxBase > 12000000) {
        calTaxAmount = 720000 + (totalTaxBase - 12000000) * 0.15;
    } else {
        calTaxAmount = totalTaxBase * 0.06;
    }

    /* 세액공제 - 근로소득 */
    var taxDeduction_work = 0;
    var outcome = 0;
    if (obj.salary > 70000000) {
        outcome = Math.max(660000 - ((obj.salary - 70000000) / 2), 500000);
    } else if (obj.salary > 33000000) {
        outcome = Math.max(740000 - ((obj.salary - 33000000) * 0.008), 660000);
    } else {
        outcome = 740000;
    }

    var max_value = 0;
    if (calTaxAmount > 1300000) {
        max_value = 715000 + ((calTaxAmount - 1300000) * 0.3);
    } else {
        max_value = calTaxAmount * 0.55;
    }
    taxDeduction_work = Math.min(max_value, outcome);

    /* 세액공제 - 자녀 */
    var taxDeduction_child = 0;
    if (obj.dependents_child > 1) {
        taxDeduction_child = (obj.dependents_child-1) * 300000;
    } else {
        taxDeduction_child = 150000;
    }

    /* 세액공제 - 연금계좌 */
    var taxDeduction_pension = 0;
    var rate_multi = (obj.salary > 55000000) ? 0.12 : 0.15; 
    var maxVal = (obj.salary > 120000000) ? 3000000 : 4000000;
    taxDeduction_pension = Math.min(maxVal, obj.privatePension) * rate_multi;

    /* 세액공제 - 보험료 */
    var taxDeduction_insurance =
        Math.min(obj.protectionInsurance, 1000000) * 0.12
        + Math.min(obj.disabledProtectionInsurance, 1000000) * 0.15;
    
    /* 세액공제 - 의료비 */
    var taxDeduction_medical =
        Math.min(obj.medicalExpenses - (obj.salary * 0.03), 7000000) * 0.15;
    if (taxDeduction_medical < 0) taxDeduction_medical = 0;
    
    /* 세액공제 - 교육비 */
    var taxDeduction_education = obj.educationalExpenses * 0.15;

    /* 세액공제 - 월세 */
    var taxDeduction_monthly = 0;
    if (obj.salary <= 70000000) {
        var rate = (obj.salary > 55000000) ? 0.1 : 0.12;
        taxDeduction_monthly = Math.min(obj.monthly, 7500000) * rate;        
    }

    /* 결정세액 */
    var taxConclusion = (calTaxAmount - taxDeduction_work - taxDeduction_child
        - taxDeduction_pension - taxDeduction_insurance - taxDeduction_medical
        - taxDeduction_education - taxDeduction_monthly) * 1.1;
    if (taxConclusion < 0) taxConclusion = 0;
    
    /* 한계세율 */
    var calTaxRate = 0;
    if (totalTaxBase > 500000000) {
        calTaxRate = 0.42;
    } else if (totalTaxBase > 300000000) {
        calTaxRate = 0.4;
    } else if (totalTaxBase > 150000000) {
        calTaxRate = 0.38;
    } else if (totalTaxBase > 88000000) {
        calTaxRate = 0.35;
    } else if (totalTaxBase > 46000000) {
        calTaxRate = 0.24;
    } else if (totalTaxBase > 12000000) {
        calTaxRate = 0.15;
    } else {
        calTaxRate = 0.06;
    }

    /* 실효세율 */
    var effectiveTaxRate = taxConclusion / obj.salary;

    table.earnedIncomeDeduction = earnedIncomeDeduction;
    table.totalIncome = totalIncome;
    table.totalIncomeDeduction_basic = totalIncomeDeduction_basic;
    table.totalIncomeDeduction_pension = totalIncomeDeduction_pension;
    table.totalIncomeDeduction_insurance = totalIncomeDeduction_insurance;
    table.totalIncomDeduction_aptApp = totalIncomDeduction_aptApp;
    table.totalIncomeDeduction_expenditure = totalIncomeDeduction_expenditure;
    table.totalTaxBase = totalTaxBase;
    table.calTaxAmount = calTaxAmount;
    table.taxDeduction_work = taxDeduction_work;
    table.taxDeduction_child = taxDeduction_child;
    table.taxDeduction_pension = taxDeduction_pension;
    table.taxDeduction_insurance = taxDeduction_insurance;
    table.taxDeduction_medical = taxDeduction_medical;
    table.taxDeduction_education = taxDeduction_education;
    table.taxDeduction_monthly = taxDeduction_monthly;
    table.taxConclusion = taxConclusion;
    table.calTaxRate = calTaxRate;
    table.effectiveTaxRate = effectiveTaxRate;

    return table;
}

exports.calculate = calculate;
exports.get_table = get_table;

exports.get_aptApp = get_aptApp;
exports.get_creditCard = get_creditCard;
exports.get_insurance = get_insurance;
exports.get_privatePension = get_privatePension;
exports.get_medical = get_medical;
exports.get_common = get_common;