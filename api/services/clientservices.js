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
  const query = "SELECT category_name, category_icon FROM categories";

  return executeQuery(query);
}

async function getOffers() {
  const query = "SELECT id, brand_name, product_name, original_price, offer_percentage, brand_logo, offer_banner_lg, offer_category, offer_type, down_color, up_color FROM offers";

  return executeQuery(query);
}

async function getOfferDetails(incomingData) {
  const query = `SELECT id, brand_name, brand_description, product_name, original_price, offer_validity, offer_percentage, min_order, brand_logo, offer_banner_lg, offer_banner_xl, offer_category, offer_type, tnc, up_color, down_color FROM offers WHERE id='${incomingData.offer_id}'`;

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
  const query = `SELECT id, brand_name, brand_description, product_name, original_price, offer_validity, offer_percentage, min_order, brand_logo, offer_category, offer_type, tnc, up_color, down_color FROM offers WHERE id='${incomingData}'`;

  return executeQuery(query);
}

module.exports = {
  getTrips,
  getTrip,
  addTrip,
  initiateSession,
  getCategories,
  getOffers,
  getOfferDetails,
  getCouponcode,
};
