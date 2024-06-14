const { executeQuery } = require("../../db/executeQuery");
const sql = require("mssql");

async function getTrips() {
  const query = "SELECT * FROM Trips";
  return executeQuery(query);
}

async function getTrip(tripId) {
  const query = `SELECT * FROM Trips WHERE id ='${tripId}' `;
  return executeQuery(query);
}

async function addTrip(trip) {
  console.log({ trip });
  const query = `
    INSERT INTO Trips 
    (tripId, userId, tripType, tripFrom, tripTo, tripDeparture, tripReturn, travellersNum, adults, childrens, class, createdAt, createdBy, updatedAt, updatedBy) 
    VALUES 
    (
        ${trip.tripId}, 
        ${trip.userId}, 
        '${trip.tripType}', 
        '${trip.tripFrom}', 
        '${trip.tripTo}', 
        '${trip.tripDeparture}', 
        '${trip.tripReturn}', 
        ${trip.travellersNum}, 
        ${trip.adults}, 
        ${trip.childrens}, 
        '${trip.class}', 
        GETDATE(), 
        ${trip.createdBy}, 
        GETDATE(), 
        ${trip.updatedBy}
    ) 
`;

  return executeQuery(query);
}

async function initiateSession(userDetails) {
  console.log({ userDetails });
  const query = `
  INSERT INTO user_details 
  (uuid, id_user, bank_name, bank_token, token, module_type, last_login, created_at, updated_at) 
  VALUES 
  (
      '${userDetails.ticketid}', 
      ${userDetails.id_user}, 
      '${userDetails.bank_name}', 
      '${userDetails.bank_token}', 
      '${userDetails.token}', 
      '${userDetails.module_type}', 
      GETDATE(), 
      GETDATE(), 
      GETDATE()
  )
`;

  return executeQuery(query);
}


async function getCategories() {
  const query = "SELECT id, category_name, file_data FROM categories";

  return executeQuery(query);
}

async function getBanner() {
  const query = "SELECT file_data, banner_click_link FROM bannerFiles WHERE ticketModule='banners'";

  return executeQuery(query);
}

async function getOffers() {
  const query = "SELECT id, brand_name, product_name, original_price, offer_percentage, brand_logo, product_pic, offer_category, offer_type, down_color, up_color FROM offers WHERE is_active=1";

  return executeQuery(query);
}

async function getOfferDetails(incomingData) {
  const query = `SELECT id, brand_name, brand_description, product_name, original_price, offer_validity, offer_percentage, min_order, brand_logo, product_pic, offer_category, offer_type, tnc, up_color, down_color FROM offers WHERE id='${incomingData.offer_id}'`;

  return executeQuery(query);
}

async function getUserId(incomingData) {
  const query = `SELECT id_user, bank_name FROM user_details WHERE token='${incomingData}'`;

  return executeQuery(query);
}

async function putUserOffer(incomingData) {
  const query = `
  INSERT INTO useroffers 
  (user_id, offer_id, redeem_code, order_id, paid_amnt, pay_mode, bank_name, redeem_status) 
  VALUES 
  (
      '${incomingData.user_id}', 
      ${incomingData.offer_id}, 
      '${incomingData.redeem_code}',
      '${incomingData.order_id}',
      '${incomingData.amt}',
      '${incomingData.pay_mode}',
      '${incomingData.bank}',
      '${incomingData.redeem_status}'

  )
`;

  return executeQuery(query);
}

async function putUserOfferPaid(incomingData) {
  const query = `
  INSERT INTO useroffers 
  (user_id, offer_id, redeem_code, transactionId, order_id, paid_amnt, pay_mode, bank_name, redeem_status) 
  VALUES 
  (
      '${incomingData.user_id}', 
      ${incomingData.offer_id}, 
      '${incomingData.redeem_code}',
      '${incomingData.transaction_id}',
      '${incomingData.order_id}',
      '${incomingData.amt}',
      '${incomingData.pay_mode}',
      '${incomingData.bank}',
      '${incomingData.redeem_status}'
      
  )
`;

  return executeQuery(query);
}

async function getCouponcode(incomingData) {
  // const query = `INSERT INTO user_coupons
  //  (offer_id, coupon_code, purchased_at, user_id)
  //  VALUES
  //  (
  //   '${incomingData.offer_id}',
  //   '${incomingData.coupon_code}',
  //   GETDATE(),
  //   '${incomingData.user_id}'
  //  )`;
  const query = `SELECT TOP 2 offers.id, offers.brand_name, offers.brand_description, offers.product_name, offers.original_price, offers.offer_validity, offers.offer_percentage, offers.min_order, offers.brand_logo, offers.offer_category, offers.offer_type, offers.tnc, offers.up_color, offers.down_color, offers.offer_url, coupon.coupon_code, coupon.id_offer FROM coupon INNER JOIN offers ON coupon.id_offer=offers.coupon_id WHERE offers.id='${incomingData}'`;

  return executeQuery(query);
}

async function putRemoveCoupon(incomingData) {
 
  const query = `DELETE TOP (1) FROM coupon WHERE coupon.id_offer='${incomingData}'`;

  return executeQuery(query);
}

async function putInactivateCoupon(incomingData) {
 
  const query = `
  UPDATE offers 
   SET is_active = 0 WHERE id='${incomingData}'
`;

  return executeQuery(query);
}

async function getMyOffers(incomingData) {
  const query = `SELECT offers.id, offers.brand_name, offers.product_name, offers.offer_validity, offers.offer_percentage, offers.min_order, offers.brand_logo, offers.offer_type, offers.up_color, offers.down_color, offers.offer_url, offers.coupon_page_logo, useroffers.redeem_code, useroffers.redeem_status, useroffers.created_at, useroffers.pay_mode, useroffers.order_id FROM useroffers INNER JOIN offers ON useroffers.offer_id=offers.id WHERE useroffers.user_id='${incomingData}'`;

  return executeQuery(query);
}


module.exports = {
  getTrips,
  getTrip,
  addTrip,
  initiateSession,
  getCategories,
  getBanner,
  getOffers,
  getOfferDetails,
  getCouponcode,
  putRemoveCoupon,
  getUserId,
  putUserOffer,
  putUserOfferPaid,
  putInactivateCoupon,
  getMyOffers,
};
