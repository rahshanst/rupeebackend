const CHEGGOUT_URL= "https://restapi-stage.cheggout.com/api/v1.2";

const GEN_SWINKPAY_ORDER_ID = `${CHEGGOUT_URL}/GenerateSwinkPayOrderID`;
const CHECK_SWINKPAY_STATUS = `${CHEGGOUT_URL}/CheckSwinkPayStatus`;
const GET_PWA_REWARDS = `${CHEGGOUT_URL}/GetPwaRewards`;
const GET_PWA_WALLET_POINTS = `${CHEGGOUT_URL}/GetPWAWalletPoints`;
const DEDUCT_WALLET_POINTS = `${CHEGGOUT_URL}/DeductWalletPoints`;

module.exports={
    GEN_SWINKPAY_ORDER_ID,
    CHECK_SWINKPAY_STATUS,
    GET_PWA_REWARDS,
    GET_PWA_WALLET_POINTS,
    DEDUCT_WALLET_POINTS,
}
