var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var package_file = require('./package.json');
var func = require('./func');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/api', function (req, res) {
    /*
        무주택여부
        총급여액
        비과세
        부양가족수
        부양가족수 - 20세 이하
        부양가족수 - 70세 이상
        부양가족수 - 장애인
        주택청약
        주택임차차입금 - 원리금상환액
        장기주택저당차입금 이자 상환액
        신용카드
        체크카드/현금영수증
        제로페이
        교통비
        전통시장
        사적연금
        보장성 보험
        장애인 보장성 보험
        의료비
        교육비
        월세
    */
    var isHomeless = req.body.isHomeless;
    var salary = req.body.salary;
    var texExemption = req.body.texExemption;
    var workingMonths = req.body.workingMonths;
    var dependents = req.body.dependents;
    var dependents_child = req.body.dependents_child;
    var dependents_old = req.body.dependents_old;
    var dependents_disabled = req.body.dependents_disabled;
    var housingOffer = req.body.housingOffer;
    var housingLeaseLoan = req.body.housingLeaseLoan;
    var longTermMortgageLoan = req.body.longTermMortgageLoan;
    var creditCard = req.body.creditCard;
    var checkCardAndCashReceipts = req.body.checkCardAndCashReceipts;
    var zeroPay = req.body.zeroPay;
    var transportationCost = req.body.transportationCost;
    var traditionalMarket = req.body.traditionalMarket;
    var privatePension = req.body.privatePension;
    var protectionInsurance = req.body.protectionInsurance;
    var disabledProtectionInsurance = req.body.disabledProtectionInsurance;
    var medicalExpenses = req.body.medicalExpenses;
    var educationalExpenses = req.body.educationalExpenses;
    var monthly = req.body.monthly;

    /* 예외 처리 */
    if (!isHomeless.length) {
        return res.status(400).json({ error: "Incorrect IsHomeless" });
    }
    
    /* 계산 함수 */
    var output2 = func.calculate([
        isHomeless, salary, texExemption, workingMonths, dependents, dependents_child,
        dependents_old, dependents_disabled, housingOffer, housingLeaseLoan,
        longTermMortgageLoan, creditCard, checkCardAndCashReceipts, zeroPay,
        transportationCost, traditionalMarket, privatePension, protectionInsurance,
        disabledProtectionInsurance, medicalExpenses, educationalExpenses, monthly
    ]);
    
    return res.status(201).json(output2);
    
});

app.listen(80, function () {
    console.log("Server running at " + 80);
});