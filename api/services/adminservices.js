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


async function addCategory(incomingData) {
  console.log({ incomingData });
  const query = `
  INSERT INTO categories 
  (category_name, category_icon, created_at, updated_at) 
  VALUES 
  (
      '${incomingData.category_name}',
      '${incomingData.category_icon}',
      GETDATE(), 
      GETDATE()
  )
`;

  return executeQuery(query);
}

async function addOffer(incomingData) {
  console.log({ incomingData });
  const query = `
  INSERT INTO offers 
  (brand_name, brand_description, product_name, original_price, offer_validity, offer_percentage, min_order, offer_category, offer_type, tnc, no_of_coupons, is_active, created_at, updated_at) 
  VALUES 
  (
      '${incomingData.brand_name}',
      '${incomingData.brand_description}',
      '${incomingData.product_name}',
      '${incomingData.original_price}',
       GETDATE(),
      '${incomingData.offer_percentage}',
      '${incomingData.min_order}',
      '${incomingData.offer_category}',
      '${incomingData.offer_type}',
      '${incomingData.tnc}',
      '${incomingData.no_of_coupons}',
      '${incomingData.is_active}',
      GETDATE(), 
      GETDATE()
  )
`;

  return executeQuery(query);
}

module.exports = {
  getTrips,
  getTrip,
  addTrip,
  addCategory,
  addOffer
  
};
