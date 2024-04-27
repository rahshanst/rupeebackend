const { executeQuery } = require("../../db/executeQuery");
const moment = require('moment');
const monthStart = moment().startOf('month').format('L');
const monthEnd = moment().endOf('month').format('L');
const today = moment().format('L');

module.exports.getDashboardCount = (condition) => {
  console.log({condition});
  const query = ` SELECT 'dailyActiveUsers' AS QueryType, COUNT(*) AS Result FROM store_user_details tud where CONVERT(DATE, tud.createdAt) = '${today}' UNION ALL
  SELECT 'noOfActiveDeals' AS QueryType, COUNT(*) AS Result FROM deals tud where isActive =1 UNION ALL
  SELECT 'noOfActiveBanks' AS QueryType, COUNT(*) AS Result FROM store_user_details tud where bank_name is not null `;
  return executeQuery(query);
};

module.exports.getBankNames = () => {
  const query = `  select distinct(bank_name) from store_user_details where bank_name is not null and bank_name != 'undefined'`;
  return executeQuery(query);
};

module.exports.getProviderNames = () => {
  const query = `select distinct(category_name) AS provider_name from categories where category_name is not null and category_name != 'undefined'`;
  return executeQuery(query);
};

module.exports.getAirPortName = () => {
  const query = `select distinct(airPortOriginName) AS airPortOriginName from flight_travel_dtls where airPortOriginName is not null and airPortOriginName != 'undefined'`;
  return executeQuery(query);
};

module.exports.getHotelNames = () => {
  const query = `select distinct(hotelName) AS hotelName from hotel_booking where hotelName is not null and hotelName != 'undefined'`;
  return executeQuery(query);
};

module.exports.getHotelLocation = () => {
  const query = `select distinct(location_area) AS location_area from hotel_booking where location_area is not null and location_area != 'undefined'`;
  return executeQuery(query);
};

// Function to fetch all brands
module.exports.getBrands = () => {
  const query = `SELECT * FROM brands`;
  return executeQuery(query);
};

// module.exports.getBrands = () => {
//   const query = `SELECT * FROM categoreis`;
//   return executeQuery(query);
// };

// Function to insert a new brand
module.exports.addBrands = (brandData) => {
  const { uuid,brand_name, category_name, bank_name, logo_image, coupon_code_bg_image } = brandData;
  const query = `INSERT INTO brands (uuid,brand_name, category_name, bank_name, logo_image, coupon_code_bg_image) 
                 VALUES ('${uuid}','${brand_name}', '${category_name}', '${bank_name}', '${logo_image}', '${coupon_code_bg_image}')`;
  return executeQuery(query);
};

// Function to update a brand by ID
module.exports.updateBrandById = (brandId, brandData) => {
  const { brand_name, category_name, bank_name, logo_image, coupon_code_bg_image } = brandData;
  const query = `UPDATE brands 
                 SET brand_name = '${brand_name}', 
                     category_name = '${category_name}', 
                     bank_name = '${bank_name}', 
                     logo_image = '${logo_image}', 
                     coupon_code_bg_image = '${coupon_code_bg_image}' 
                 WHERE id = ${brandId}`;
  return executeQuery(query);
};

// Function to delete a brand by ID
module.exports.deleteBrandById = (brandId) => {
  const query = `DELETE FROM brands WHERE id = ${brandId}`;
  return executeQuery(query);
};

// Function to fetch all deals
module.exports.getDeals = () => {
  const query = `SELECT * FROM deals`;
  return executeQuery(query);
};

// Similarly, you can create insert, update, delete functions for deals, categories, and banners

  // Function to fetch all deals
module.exports.getCategoryDetails = () => {
  const query = `SELECT * FROM categories`;
  return executeQuery(query);
};
module.exports.getDetalsDetails = () => {
  const query = `SELECT * FROM deals`;
  return executeQuery(query);
};

// Function to insert a new deal
module.exports.insertDeal = (dealData) => {
  console.log({dealData});
  const { uuid,deal_name, category_name,brand, cover_image, detail_page_image, min_order_value, max_discount_value, 
          offer_expiry_date, how_to_redeem, terms_and_conditions, deal_price_rs, deal_price_coins, 
          offer_redemption_url, coupon_codes_csv } = dealData;
  const query = `INSERT INTO deals (uuid,deal_heading, category_name,brand, cover_image, detail_page_image, min_order_value, 
                                    max_discount_value, offer_expiry_date, how_to_redeem, terms_and_conditions, 
                                    deal_price_rs, deal_price_coins, offer_redemption_url, coupon_codes_csv) 
                 VALUES ('${uuid}','${deal_name}', '${category_name}', '${brand}','${cover_image}', '${detail_page_image}', '${min_order_value}', 
                         '${max_discount_value}', '${offer_expiry_date}', '${how_to_redeem}', '${terms_and_conditions}', 
                         '${deal_price_rs}', '${deal_price_coins}', '${offer_redemption_url}', '${coupon_codes_csv}')`;
  return executeQuery(query);
};

// Function to update a deal by ID
module.exports.updateDealById = (dealId, dealData) => {
  const { deal_name, category_name, cover_image, detail_page_image, min_order_value, max_discount_value, 
          offer_expiry_date, how_to_redeem, terms_and_conditions, deal_price_rs, deal_price_coins, 
          offer_redemption_url, coupon_codes_csv } = dealData;
  const query = `UPDATE deals 
                 SET deal_name = '${deal_name}', 
                     category_name = '${category_name}', 
                     cover_image = '${cover_image}', 
                     detail_page_image = '${detail_page_image}', 
                     min_order_value = ${min_order_value}, 
                     max_discount_value = ${max_discount_value}, 
                     offer_expiry_date = '${offer_expiry_date}', 
                     how_to_redeem = '${how_to_redeem}', 
                     terms_and_conditions = '${terms_and_conditions}', 
                     deal_price_rs = ${deal_price_rs}, 
                     deal_price_coins = ${deal_price_coins}, 
                     offer_redemption_url = '${offer_redemption_url}', 
                     coupon_codes_csv = '${coupon_codes_csv}' 
                 WHERE id = ${dealId}`;
  return executeQuery(query);
};

// Function to delete a deal by ID
module.exports.deleteDealById = (dealId) => {
  const query = `DELETE FROM deals WHERE id = ${dealId}`;
  return executeQuery(query);
};

// Function to fetch all banners
module.exports.getBanners = () => {
  const query = `SELECT * FROM banners`;
  return executeQuery(query);
};

// Function to insert a new banner
module.exports.insertBanner = (bannerData) => {
  const { banner_name, category_name, banner_image } = bannerData;
  const query = `INSERT INTO banners (banner_name, category_name, banner_image) 
                 VALUES ('${banner_name}', '${category_name}', '${banner_image}')`;
  return executeQuery(query);
};

// Function to update a banner by ID
module.exports.updateBannerById = (bannerId, bannerData) => {
  const { banner_name, category_name, banner_image } = bannerData;
  const query = `UPDATE banners 
                 SET banner_name = '${banner_name}', 
                     category_name = '${category_name}', 
                     banner_image = '${banner_image}' 
                 WHERE id = ${bannerId}`;
  return executeQuery(query);
};

// Function to delete a banner by ID
module.exports.deleteBannerById = (bannerId) => {
  const query = `DELETE FROM banners WHERE id = ${bannerId}`;
  return executeQuery(query);
};


module.exports.addBankConfig = (data) => {
  const query = `INSERT INTO bankConfig (
    id_user,
    bankName,
    ticketModule,
    primaryColor,
    secondaryColor,
    logoColor,
    interNationalCashbackAmount,
    nationalCashbackAmount,
    NewCustInterNationalCashbackAmount,
    NewCustNationalCashbackAmount,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt
) VALUES (
    ${data.id_user},
    '${data.bankName}',
    '${data.ticketModule}',
    '${data.primaryColor}',
    '${data.secondaryColor}',
    '${data.logoColor}',
    ${data.interNationalCashbackAmount},
    ${data.nationalCashbackAmount},
    ${data.NewCustInterNationalCashbackAmount},
    ${data.NewCustNationalCashbackAmount},
    '${data.createdBy}',
    GETDATE(),
    '${data.updatedBy}',
    GETDATE()
);
`;
  return executeQuery(query);
};


module.exports.updateBankConfig = (data) => {
  const query = `UPDATE bankConfig
  SET
      bankName = '${data.bankName}',
      primaryColor = '${data.primaryColor}',
      ticketModule = '${data.ticketModule}',
      secondaryColor = '${data.secondaryColor}',
      logoColor = '${data.logoColor}',
      updatedBy = '${data.updatedBy}',
      updatedAt = GETDATE()
  WHERE
      bankName = '${data.bankName}' AND ticketModule = '${data.ticketModule}';
`;
  return executeQuery(query);
};

module.exports.getBankConfig = (data) => {
  const query = `SELECT bankName,
  primaryColor,
  ticketModule,
  secondaryColor,
  logoColor FROM bankConfig WHERE bankName = '${data.bankName}' AND ticketModule = '${data.ticketModule}';`;
  return executeQuery(query);
};

module.exports.getComercialConfigBySectionName = (data) => {
  const query = `SELECT * FROM comercialConfig WHERE sectionName = 'convenience';`;
  return executeQuery(query);
};

module.exports.getBannerFile = (data) => {
  const query = `SELECT * FROM bannerFiles WHERE (bankName = '${data.bankName}' OR bankName = 'commercial' ) and ticketModule = '${data.ticketModule}';
`;
  return executeQuery(query);
};
module.exports.getBannerFileAdmin = (data) => {
  const query = `SELECT * FROM bannerFiles WHERE ticketModule = '${data.ticketModule}';
`;
  return executeQuery(query);
};
module.exports.addBannerFile = (data) => {
  const query = `INSERT INTO bannerFiles (
    id_user,
    bankName,
    ticketModule,
    occation,
    file_name,
    file_data,
    file_type,
    createdBy,
    createdAt,
    updatedBy,
    updatedAt
) VALUES (
    ${data.id_user},
    '${data.bankName}',
    '${data.ticketModule}',
    '${data.occation}',
    '${data.file_name}',
    '${data.file_data}',
    '${data.file_type}',
    '${data.createdBy}',
    GETDATE(),
    '${data.updatedBy}',
    GETDATE()
);`;
  return executeQuery(query);
};

module.exports.deleteBannerFile = (data) => {
  const query = `delete from bannerFiles WHERE ticketModule = '${data.ticketModule}';
`;
  return executeQuery(query);
};

module.exports.addComercialConfig = (data) => {
  const query = `INSERT INTO [dbo].[comercialConfig] 
  ([sectionName], [internationalHotel], [domesticHotel], [internatinalFlight], [domesticFlight], [chargeValueType],  [ui_message],  [createdBy], [createdtAt], [updatedBy], [updatedAt]) 
VALUES 
  ('${data.sectionName}', ${data.internationalHotel}, ${data.domesticHotel}, ${data.internatinalFlight}, ${data.domesticFlight}, '${data.chargeValueType}',  '${data.ui_message}','${data.createdBy}', GETDATE(), '${data.updatedBy}', GETDATE());
`;
  return executeQuery(query);
};

module.exports.updateComercialConfig = (data) => {
  const query = `UPDATE [dbo].[comercialConfig] 
  SET 
      [internationalHotel] = ${data.internationalHotel}, 
      [domesticHotel] = ${data.domesticHotel}, 
      [internatinalFlight] = ${data.internatinalFlight}, 
      [domesticFlight] = ${data.domesticFlight}, 
      [chargeValueType] = '${data.chargeValueType}', 
      [ui_message] = '${data.ui_message}', 
      [updatedBy] = '${data.updatedBy}', 
      [updatedAt] = GETDATE() 
  WHERE 
  [sectionName] = '${data.sectionName}'
  `;
  return executeQuery(query);
};

module.exports.getRecordBySectionName = (sectionName) => {
  const query = `SELECT * from [comercialConfig] WHERE 
  [sectionName] = '${sectionName}'`;
  return executeQuery(query);
};

module.exports.getAllCommercialConfig = (sectionName) => {
  const query = `SELECT * from [comercialConfig]`;
  return executeQuery(query);
};