const CHEGGOUT_URL= "https://restapi-stage.cheggout.com/api/v1.2";

const GEN_SWINKPAY_ORDER_ID = `${CHEGGOUT_URL}/GenerateSwinkPayOrderID`;
const CHECK_SWINKPAY_STATUS = `${CHEGGOUT_URL}/CheckSwinkPayStatus`;

module.exports={
    GEN_SWINKPAY_ORDER_ID,
    CHECK_SWINKPAY_STATUS,
}

