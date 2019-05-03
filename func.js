function calculate([isHomeless, salary, texExemption, workingMonths, dependents, dependents_child,
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
    } else if (ojb.salary > 15000000) {
        earnedIncomeDeduction = 7500000 + (obj.salary - 15000000) * 0.15;
    } else if (obj.salary > 5000000) {
        earnedIncomeDeduction = 3500000 + (obj.salary - 5000000) * 0.4;
    } else {
        earnedIncomeDeduction = obj.salary * 0.7;
    }
    /* -------------------------------------------- */
    
    /* 종합소득금액 */
    var totalIncome = obj.texExemption - earnedIncomeDeduction;

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
    if (obj.salary <= 70000000 && obj.isHomeless == true) {
        totalIncomDeduction_aptApp = Math.min(2400000, obj.housingOffer) * 0.4;
    }

    /* 종합소득공제 - 신용카드 등 */
    var totalIncomeDeduction_expenditure = 0;
    var min_expenditure_value = obj.salary * 0.25;
    var minimumValue = 12500000;
    
    var nCreditCard = obj.creditCard - minimumValue;    //신용카드
    nCreditCard = (nCreditCard < 0) ? 0 : nCreditCard;
    minimumValue = (minimumValue < obj.creditCard) ? 0 : minimumValue - obj.creditCard;
    totalIncomeDeduction_expenditure += nCreditCard * 0.15;
    
    var nCheckCard = obj.checkCardAndCashReceipts - minimumValue;   // 체크카드, 현금영수증
    nCheckCard = (nCheckCard < 0) ? 0 : nCheckCard;
    minimumValue = (minimumValue < obj.checkCardAndCashReceipts) ? 0 : minimumValue - obj.checkCardAndCashReceipts;
    totalIncomeDeduction_expenditure += nCheckCard;
    
    var nZeroPay = obj.zeroPay - minimumValue;      //제로페이
    nZeroPay = (nZeroPay < 0) ? 0 : nZeroPay;
    minimumValue = (minimumValue < obj.zeroPay) ? 0 : minimumValue - obj.zeroPay;
    totalIncomeDeduction_expenditure += nZeroPay;

    var nTransportationCost = obj.transportationCost - minimumValue;    // 교통비
    nTransportationCost = (nTransportationCost < 0) ? 0 : nTransportationCost;
    minimumValue = (minimumValue < obj.transportationCost) ? 0 : minimumValue - obj.transportationCost;
    totalIncomeDeduction_expenditure += nTransportationCost;

    var nTraditionalMarket = obj.traditionalMarket - minimumValue;      // 전통시장
    nTraditionalMarket = (nTraditionalMarket < 0) ? 0 : nTraditionalMarket;
    minimumValue = (minimumValue < obj.traditionalMarket) ? 0 : minimumValue - obj.traditionalMarket;
    totalIncomeDeduction_expenditure += nTraditionalMarket;

    var maxValue = 0;
    if (maxValue > 120000000) {
        maxValue = 2000000;
    } else if (maxValue > 7000000) {
        maxValue = 2500000;
    } else {
        maxValue = 3000000;
    }

    totalIncomeDeduction_expenditure = Math.min(totalIncomeDeduction_expenditure, maxValue);

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

    return JSON.stringify(table);
}

exports.calculate = calculate;