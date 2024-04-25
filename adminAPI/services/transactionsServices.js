const { executeQuery } = require("../../db/executeQuery");


module.exports.getTransactionDtlsById = (id_booking) => {
  const query = `SELECT * from flight_transaction_dtls where id_booking='${id_booking}'`;
  return executeQuery(query);
};


module.exports.getLoginDataBysearchId = (id_user) => {
  const query = `SELECT * from store_user_details where id_user='${id_user}'`;
  return executeQuery(query);
};

module.exports.getTransactionDetails = (conditions,filter) => {
  const whereClause = conditions
  ? `WHERE ${conditions} AND ftd.status is not null`
  : " WHERE ftd.status is not null ";
  const query = `SELECT     distinct
    tud.bank_name, 
    ftd.updatedAt as transactiondate,
    ftd.id_user as userId,   
    ftd.createdAt as flightCreatedAt,   
    ftd.updatedAt as flightUpdatedAt,  
    ftd.id_booking as flightBookingId, 
    ftd.paymanetMode as bookingType, 
    ftd.actual_amnt as actual_amnt, 
    ftd.paymentTrxId as transactionId, 

    ft.id_trip as flightSearchId, 
    ftd.ticketModule,     
    ft.contactName as flightContactName, 
    hb.first_name as hotelUserFirstName,   
    hb.last_name as hotelUserLastName,  
     ftd.status as bookingStatus
  FROM flight_transaction_dtls ftd    
  LEFT JOIN  hotel_booking hb ON ftd.id_booking = hb.bookingId    
  LEFT JOIN  flight_travel_dtls ft ON ftd.id_booking = ft.bookingId   
  LEFT JOIN store_user_details tud ON tud.id_user = ftd.id_user
  ${whereClause} 
   ORDER BY ftd.createdAt DESC
   OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
   FETCH NEXT ${filter.page_size} ROWS ONLY`;
  return executeQuery(query);
};
