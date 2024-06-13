const { executeQuery } = require("../../db/executeQuery");
const moment = require('moment');
const monthStart = moment().startOf('month').format('L');
const monthEnd = moment().endOf('month').format('L');
const today = moment().format('L');

module.exports.getDashboardCount = (condition) => {
  console.log({condition});
  const query = ` SELECT 'dailyActiveUsers' AS QueryType, COUNT(*) AS Result FROM user_details 
  WHERE CONVERT(DATE, created_at) = '${today}' UNION ALL
  SELECT 'noOfActiveDeals' AS QueryType, COUNT(*) AS Result FROM deals
  UNION ALL
  SELECT 'totalRepeatedCustomers' AS QueryType, COUNT(*) AS Result FROM (
    SELECT id_user
    FROM user_details
    GROUP BY id_user
    HAVING COUNT(*) > 1 ) AS repeated_customers UNION ALL
  SELECT 'noOfActiveBrands' AS QueryType, COUNT(*) AS Result FROM brands
  UNION ALL
  SELECT 'noOfCustomers' AS QueryType, COUNT(DISTINCT id_user) AS Result FROM user_details 
  UNION ALL SELECT 'noOfActiveBanks' AS QueryType, COUNT(DISTINCT bank_name) AS Result FROM user_details 
  WHERE bank_name IS NOT NULL; `;
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

// Function to fetch all deals
module.exports.getDeals = () => {
  const query = `SELECT * FROM deals`;
  return executeQuery(query);
};

// Similarly, you can create insert, update, delete functions for deals, categories, and banners

  // Function to fetch all deals
module.exports.getCategoryDetails = (filter) => {
  const query = `SELECT * FROM categories 
  ORDER BY created_at DESC
  OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`;
  return executeQuery(query);
};
module.exports.getTransactionDetails = (filter) => {
  const query = `SELECT * FROM useroffers 
  ORDER BY created_at DESC
  OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`;
  return executeQuery(query);
};
module.exports.getDetalsDetails = (filter) => {
  const query = `SELECT * FROM deals
  ORDER BY created_at DESC
  OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`;
  return executeQuery(query);
};

module.exports.getDealsById = () => {
  const query = `SELECT * FROM deals WHERE id = ${dealId}`;
  return executeQuery(query);
};
// Create a new deal
module.exports.createDeal = (dealData) => {
  const {
    uuid,
    category,
    brand,
    category_name,
    isActive,
    cover_image,
    deal_heading,
    detail_page_image,
    min_order_value,
    max_discount_value,
    offer_expiry_date,
    how_to_redeem,
    terms_and_conditions,
    deal_price_rs,
    deal_price_coins,
    offer_redemption_url,
    coupon_codes_csv,
    createdBy,
    updatedBy,
    cover_img_file_name,
    cover_img_file_data,
    cover_img_file_type,
    detail_img_file_name,
    detail_img_file_data,
    detail_img_file_type,
    coupons_img_file_name,
    coupons_img_file_data,
    coupons_img_file_type,
    no_of_coupons
  } = dealData;

  const query = `
    INSERT INTO Deals (
      uuid,
      category,
      brand,
      category_name,
      isActive,
      cover_image,
      deal_heading,
      detail_page_image,
      min_order_value,
      max_discount_value,
      offer_expiry_date,
      how_to_redeem,
      terms_and_conditions,
      deal_price_rs,
      deal_price_coins,
      offer_redemption_url,
      coupon_codes_csv,
      createdBy,
      updatedBy,
      cover_img_file_name,
      cover_img_file_data,
      cover_img_file_type,
      detail_img_file_name,
      detail_img_file_data,
      detail_img_file_type,
      coupons_img_file_name,
      coupons_img_file_data,
      coupons_img_file_type,
      no_of_coupons
    )
    VALUES (
      '${uuid}',
      '${category}',
      '${brand}',
      '${category_name}',
      ${isActive},
      '${cover_image}',
      '${deal_heading}',
      '${detail_page_image}',
      ${min_order_value},
      ${max_discount_value},
      '${offer_expiry_date}',
      '${how_to_redeem}',
      '${terms_and_conditions}',
      ${deal_price_rs},
      ${deal_price_coins},
      '${offer_redemption_url}',
      '${coupon_codes_csv}',
      '${createdBy}',
      '${updatedBy}',
      '${cover_img_file_name}',
      '${cover_img_file_data}',
      '${cover_img_file_type}',
      '${detail_img_file_name}',
      '${detail_img_file_data}',
      '${detail_img_file_type}',
      '${coupons_img_file_name}',
      '${coupons_img_file_data}',
      '${coupons_img_file_type}',
      '${no_of_coupons}'
    )`;

  return executeQuery(query);
};

// Read all deals
module.exports.getAllDeals = (filter) => {
  const query = ` select o.id,
  o.brand_name,
  o.brand_description,
  o.product_name,
  o.original_price,
  o.offer_validity,
  o.offer_percentage,
  o.min_order,
  o.brand_logo,
  o.product_pic,
  o.offer_category,
  o.offer_type,
  o.tnc,
  o.no_of_coupons,
  o.up_color,
  o.down_color,
  CAST(CAST('' AS XML).value('xs:base64Binary(sql:column("o.offer_url"))', 'VARBINARY(MAX)') AS VARCHAR(MAX)) AS offer_url,
  o.is_active,
  o.created_at,
  o.updated_at,
  o.creator,
  o.updater,
  o.coupon_counter,
  o.coupon_file,
  o.coupon_id,
  o.coupon_page_logo,
  CAST(CAST('' AS XML).value('xs:base64Binary(sql:column("o.banner_click_link"))', 'VARBINARY(MAX)') AS VARCHAR(MAX)) AS banner_click_link,
  c.category_name
  FROM offers o
  LEFT JOIN categories c ON o.offer_category = c.id
  WHERE 1 = 1
  ${filter.brand_name ? `AND o.brand_name = '${filter.brand_name}'` : ''}
  ${filter.offer_category ? `AND o.offer_category = ${filter.offer_category}` : ''}
  ${filter.offer_validity_start ? `AND o.offer_validity >= '${filter.offer_validity_start}'` : ''}
  ${filter.offer_validity_end ? `AND o.offer_validity <= '${filter.offer_validity_end}'` : ''}
  ${filter.original_price_min ? `AND CAST(o.original_price AS DECIMAL) >= ${filter.original_price_min}` : ''}
  ${filter.original_price_max ? `AND CAST(o.original_price AS DECIMAL) <= ${filter.original_price_max}` : ''}
  ${filter.offer_percentage_min ? `AND o.offer_percentage >= ${filter.offer_percentage_min}` : ''}
  ${filter.offer_percentage_max ? `AND o.offer_percentage <= ${filter.offer_percentage_max}` : ''}
  ${filter.min_order_min ? `AND o.min_order >= ${filter.min_order_min}` : ''}
  ${filter.min_order_max ? `AND o.min_order <= ${filter.min_order_max}` : ''}
  ${filter.coupon_counter_min ? `AND o.coupon_counter >= ${filter.coupon_counter_min}` : ''}
  ${filter.coupon_counter_max ? `AND o.coupon_counter <= ${filter.coupon_counter_max}` : ''}
  ${filter.is_active  ? `AND o.is_active = ${filter.is_active}` : ''}
  ORDER BY o.created_at DESC
  OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`;
  return executeQuery(query);
};

// Read a deal by ID
module.exports.getDealById = (id) => {
  const query = `SELECT 
  o.id,
  o.brand_name,
  o.brand_description,
  o.product_name,
  o.original_price,
  o.offer_validity,
  o.offer_percentage,
  o.min_order,
  o.brand_logo,
  o.product_pic,
  o.offer_category,
  o.offer_type,
  o.tnc,
  o.no_of_coupons,
  o.up_color,
  o.down_color,
  CAST(CAST('' AS XML).value('xs:base64Binary(sql:column("o.offer_url"))', 'VARBINARY(MAX)') AS VARCHAR(MAX)) AS offer_url,
  o.is_active,
  o.created_at,
  o.updated_at,
  o.creator,
  o.updater,
  o.coupon_counter,
  o.coupon_file,
  o.coupon_id,
  o.coupon_page_logo,
  CAST(CAST('' AS XML).value('xs:base64Binary(sql:column("o.banner_click_link"))', 'VARBINARY(MAX)') AS VARCHAR(MAX)) AS banner_click_link,
  c.category_name
FROM offers o
LEFT JOIN categories c ON o.offer_category = c.id
WHERE o.id = ${id}`;
  return executeQuery(query);
};

// Update a deal by ID
module.exports.updateDealById = (dealData) => {
  console.log({dealData});
  const { id, ...updatedData } = dealData;

  console.log({updatedData});

  const updateValues = Object.entries(updatedData)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');

  const query = `
    UPDATE offers
    SET ${updateValues}
    WHERE id = ${id}`;

  return executeQuery(query);
};

// Delete a deal by ID
module.exports.deleteDealById = (id) => {
  const query = `DELETE FROM offers WHERE id = ${id}`;
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
function urlToBase64(url) {
  return btoa(url);
}
module.exports.addBannerFile = (data) => {
  const url_banner_click_link = `${data.banner_click_link}`;
const base64Url2 = urlToBase64(url_banner_click_link);
console.log(base64Url2);
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
    banner_click_link,
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
    ${data.banner_click_link ?`'${base64Url2}',`:',' }
    GETDATE()
);`;
  return executeQuery(query);
};

module.exports.updatedBannerFile = (data) => {
  const url_banner_click_link = `${data.banner_click_link}`;
const base64Url2 = urlToBase64(url_banner_click_link);
console.log(base64Url2);
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
    banner_click_link,
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
    ${data.banner_click_link ?` banner_click_link = '${base64Url2}',`:'' }
    GETDATE()
);`;
  return executeQuery(query);
};
module.exports.deleteBannerFile = (data) => {
  const query = `delete from bannerFiles WHERE ticketModule = '${data.ticketModule}' and  id= '${data.id}';
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
// Create a new brand
module.exports.createBrand = (brandData) => {
  const {
    uuid,
    brand_name,
    category_name,
    bank_name,
    logo_image,
    logo_file_name,
    logo_file_data,
    logo_file_type,
    coupon_code_bg_image,
    bg_file_name,
    bg_file_data,
    bg_file_type,
    createdBy,
    updatedBy
  } = brandData;

  const query = `
    INSERT INTO Brands (
      uuid,
      brand_name,
      category_name,
      bank_name,
      logo_image,
      logo_file_name,
      logo_file_data,
      logo_file_type,
      coupon_code_bg_image,
      bg_file_name,
      bg_file_data,
      bg_file_type,
      createdBy,
      updatedBy
    )
    VALUES (
      '${uuid}',
      '${brand_name}',
      '${category_name}',
      '${bank_name}',
      '${logo_image}',
      '${logo_file_name}',
      '${logo_file_data}',
      '${logo_file_type}',
      '${coupon_code_bg_image}',
      '${bg_file_name}',
      '${bg_file_data}',
      '${bg_file_type}',
      '${createdBy}',
      '${updatedBy}'
    )`;

  return executeQuery(query);
};

// Read all brands
module.exports.getAllBrands = () => {
  const query = `SELECT * FROM Brands`;
  return executeQuery(query);
};

// Read a brand by ID
module.exports.getBrandById = (id) => {
  const query = `SELECT * FROM Brands WHERE id = ${id}`;
  return executeQuery(query);
};

// Update a brand by ID
module.exports.updateBrandById = (brandData) => {
  const { id, ...updatedData } = brandData;

  const updateValues = Object.entries(updatedData)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');

  const query = `
    UPDATE Brands
    SET ${updateValues}
    WHERE id = ${id}`;

  return executeQuery(query);
};

// Delete a brand by ID
module.exports.deleteBrandById = (id) => {
  const query = `DELETE FROM Brands WHERE id = ${id}`;
  return executeQuery(query);
};
module.exports.searchCategory = (val) => {
  const query = `SELECT [category_name],[file_name],[file_type],[file_data],[created_at] FROM [dbo].[categories]  
  [category_name] LIKE '%${val}%'`;
  return executeQuery(query);
};

module.exports.filterByBrand = (val) => {
  console.log({val});
  const query = ` SELECT 'dailyActiveUsers' AS QueryType, COUNT(*) AS Result FROM user_details 
  WHERE CONVERT(DATE, created_at) = '${today}' UNION ALL
  SELECT 'noOfActiveDeals' AS QueryType, COUNT(*) AS Result FROM deals
  UNION ALL
  SELECT 'totalRepeatedCustomers' AS QueryType, COUNT(*) AS Result FROM (
    SELECT id_user
    FROM user_details
    GROUP BY id_user
    HAVING COUNT(*) > 1 ) AS repeated_customers UNION ALL
  SELECT 'noOfActiveBrands' AS QueryType, COUNT(*) AS Result FROM brands
  UNION ALL
  SELECT 'noOfCustomers' AS QueryType, COUNT(DISTINCT id_user) AS Result FROM user_details 
  UNION ALL SELECT 'noOfActiveBanks' AS QueryType, COUNT(DISTINCT bank_name) AS Result FROM user_details 
  WHERE bank_name IS NOT NULL; `;
  return executeQuery(query);
};


module.exports.getBrandName = () => {
  const query = `  select distinct(brand_name) from offers`;
  return executeQuery(query);
};
module.exports.searchDeals = (searchValue) => {
  const query = ` SELECT o.*, c.category_name
  FROM offers o
  LEFT JOIN categories c ON o.offer_category = c.id
  WHERE 
    o.brand_name LIKE '%${searchValue}%' OR
    o.offer_category LIKE '%${searchValue}%' OR
    o.offer_validity LIKE '%${searchValue}%' OR
    CAST(o.original_price AS VARCHAR) LIKE '%${searchValue}%' OR
    o.offer_percentage LIKE '%${searchValue}%' OR
    o.min_order LIKE '%${searchValue}%' OR
    o.coupon_counter LIKE '%${searchValue}%' OR
    c.category_name LIKE '%${searchValue}%' OR
    o.product_name LiKE '%${searchValue}%'`;
  
  return executeQuery(query);
};
module.exports.searchCategory = (val) => {
  const query = `SELECT [category_name],[file_name],[file_type],[file_data],[created_at] FROM [dbo].[categories] WHERE 
  [category_name] LIKE '%${val}%'`;
  return executeQuery(query);
};


module.exports.searchTransactions = (val) => {
  const query = `SELECT 
  [user_id],
  [offer_id],
  [redeem_code],
  [redeem_status],
  [transactionId],
  [order_id],
  [paid_amnt],
  [cashback],
  [payment_type],
  [payment_id],
  [bank_name],
  [created_at],
  [updated_at],
  [updater]
FROM 
  [dbo].[useroffers]
WHERE 
  [user_id] LIKE '%${val}%'
  OR [offer_id] LIKE '%${val}%'
  OR [redeem_code] LIKE '%${val}%'
  OR [redeem_status] LIKE '%${val}%'
  OR [transactionId] LIKE '%${val}%'
  OR [order_id] LIKE '%${val}%'
  OR [paid_amnt] LIKE '%${val}%'
  OR [cashback] LIKE '%${val}%'
  OR [payment_type] LIKE '%${val}%'
  OR [payment_id] LIKE '%${val}%'
  OR [bank_name] LIKE '%${val}%'
  OR [updater] LIKE '%${val}%';`;
  return executeQuery(query);
};