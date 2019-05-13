## TEXCAL Rest API Server _ 심플 절세 솔루션
### 제작
#### ----------------------------------------------
#### 기획 : 정자현 / **********@naver.com / 고려대학교
#### 개발 : 정근화 / rmsghk4254@naver.com / 홍익대학교
#### ----------------------------------------------
ex:) 예제
~~~
curl -X POST http://34.83.160.40/api/ **CATEGORY** \ 
--data "isHomeless=1& \                         // 무주택여부
        salary=50000000& \                      // 연봉
        texExemption=0& \                       // 비과세
        workingMonths=12& \                     // 근무 월 수
        dependents=4& \                         // 부양가족수
        dependents_child=1& \                   // 부양가족수 - 20세 이하
        dependents_old=1& \                     // 부양가족수 - 70세 이상
        dependents_disabled=1& \                // 부양가족수 - 장애인
        housingOffer=300000& \                  // 주택청약
        housingLeaseLoan=0& \                   // 주택임차차입금 원리금 상환액
        longTermMortgageLoan=0& \               // 장기주택저당차입금 이자 상환액
        creditCard=5000000& \                   // 신용카드
        checkCardAndCashReceipts=12000000& \    // 체크카드/현금영수증
        zeroPay=100000& \                       // 제로페이
        transportationCost=2400000& \           // 교통비
        traditionalMarket=2000000& \            // 전통시장
        privatePension=600000& \                // 사적연금
        protectionInsurance=2000000& \          // 보장성보험
        disabledProtectionInsurance=0& \        // 장애인 보장성 보험
        medicalExpenses=400000& \               // 의료비
        educationalExpenses=200000& \           // 교육비
        monthly=2400000"                        // 월세 
~~~
   
### CATEGORY
Category | 설명
------|------
/api/**table**               | 세금계산용 테이블
/api/**aptApp**              | 주택청약
/api/**creditCard**          | 신용카드
/api/**insurance**           | 보험료
/api/**privatePension**      | 사적연금
/api/**medical**             | 의료비
/api/**common**              | 공통


##### making... return 값 추후 설명