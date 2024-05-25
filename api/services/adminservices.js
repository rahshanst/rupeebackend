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
  (category_name, category_icon, file_data,file_name,file_type,creator,updater,created_at, updated_at) 
  VALUES 
  (
      '${incomingData.category_name}',
      '${incomingData.category_icon}',
      '${incomingData.file_data}',
      '${incomingData.file_name}',
      '${incomingData.file_type}',
      '${incomingData.creator}',
      '${incomingData.updater}',
      GETDATE(), 
      GETDATE()
  )
`;

  return executeQuery(query);
}
async function updateCategory(incomingData) {
  console.log({ incomingData });
  const query = ` UPDATE categories SET
  category_name='${incomingData.category_name}', 
  category_icon = '${incomingData.category_icon}',
  file_data = '${incomingData.file_data}',
  file_name = '${incomingData.file_name}',
  file_type = '${incomingData.file_type}',
  updater = '${incomingData.updater}',
  updated_at= GETDATE()  where id= '${incomingData.id}'`;

  return executeQuery(query);
}
async function getCategoryById(incomingData) {
  console.log({ incomingData });
  const query = ` select * from categories where id= '${incomingData.id}'`;

  return executeQuery(query);
}


async function getCouponIdByOfferId(incomingData) {
  console.log({ incomingData });
  const query = ` select coupon_id from offers where id= '${incomingData.id}'`;

  return executeQuery(query);
}

async function deleteCategoryById(incomingData) {
  console.log({ incomingData });
  const query = ` delete from categories where id= '${incomingData.id}'`;

  return executeQuery(query);
}
async function addOffer(incomingData) {
  console.log({ incomingData });
  const query = `
  INSERT INTO offers 
  (brand_name, brand_description, product_name, original_price,
    offer_validity, offer_percentage, min_order,brand_logo,product_pic,
    offer_category, offer_type, tnc, no_of_coupons,
    is_active,
    up_color,
    offer_url,
    down_color,
    coupon_file,
     created_at, updated_at,coupon_id)
  VALUES 
  (
      '${incomingData.brand_name}',
      '${incomingData.brand_description}',
      '${incomingData.product_name}',
      '${incomingData.original_price}',
      '${incomingData.offer_validity}',
      '${incomingData.offer_percentage}',
      '${incomingData.min_order}',
      '${incomingData.brand_logo}',
      '${incomingData.product_pic}',
      '${incomingData.offer_category}',
      '${incomingData.offer_type}',
      '${incomingData.tnc}',
      '${incomingData.no_of_coupons}',
      '${incomingData.is_active}',
      '${incomingData.offer_url}',
      '${incomingData.up_color}',
      '${incomingData.down_color}',
      '${incomingData.coupon_file}',
      GETDATE(), 
      GETDATE(),
      '${incomingData.coupon_id}'
  )
`;

  return executeQuery(query);
}

async function updateOfferById(dealData) {
  const { id, is_brand_logo, is_product_pic, is_coupon_file, ...updatedData } = dealData;

  console.log({ id, updatedData });

  // Filter out undefined values
  const validEntries = Object.entries(updatedData).filter(([key, value]) => value !== undefined);

  console.log({validEntries});
  // Map to key-value pairs for the SQL query
  const updateValues = validEntries
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');

  // Ensure there's something to update
  if (updateValues.length === 0) {
    throw new Error('No valid fields to update');
  }

  const query = `
    UPDATE offers
    SET ${updateValues}
    WHERE id = ${id}`;

  return executeQuery(query);
};

async function addCoupon(incomingData) {
  console.log({ incomingData });
  const query = ` INSERT INTO coupon (id_offer,brand_name,coupon_code,is_active,createdBy) VALUES 
  ( '${incomingData.id_offer}','${incomingData.brand_name}', '${incomingData.coupon_code}', '${incomingData.is_active}','admin');
`;

  return executeQuery(query);
}

async function updateCouponOfferById(dealData) {
  console.log({dealData});
  const { id_offer, ...updatedData } = dealData;

  console.log({updatedData});

  const updateValues = Object.entries(updatedData)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');

  const query = `
    UPDATE coupon
    SET ${updateValues}
    WHERE id_offer = '${id_offer}'`;

  return executeQuery(query);
};

module.exports = {
  updateCouponOfferById,
  updateOfferById,
  getCouponIdByOfferId,
  addCoupon,
  getTrips,
  getTrip,
  addTrip,
  addCategory,
  updateCategory,
  getCategoryById,
  deleteCategoryById,
  addOffer,
};
