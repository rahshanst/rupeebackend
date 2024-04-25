const { executeQuery } = require("../../db/executeQuery");
const logger = require("../../utils/logger");

module.exports.getFligtBookingDetails = (conditions, filter) => {
  logger.info({ conditions });
  const pagination=`OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`
  const whereClause = conditions
    ? `WHERE ${conditions} AND  ftd.status ='Booked' and ft.bookingId is not null `
    : " WHERE ftd.status ='Booked' and ft.bookingId is not null";
  const query = `SELECT  distinct  ftd.id_user as userId, ftd.createdAt as createdAt,  ftd.updatedAt as updatedAt, ftd.id_booking as bookingId, ft.id_trip as flightSearchId,   
  ftd.ticketModule,     ftd.status as bookingStatus,     ft.roundTripFlightTimeOrigin as returnOriginTime, 
  ft.roundTripFlightTimeDestination as returnDestinationTime,     ft.roundTripAirPortDestinationName as returnDestinationAirPort,   
  ft.roundTripAirPortOriginName as returnOriginAirPort,     ft.provider_name as providerName,     ft.flightAggregator as aggregatorName,  
  ft.contact_email as contactEmail,
  tud.bank_name, 
  tud.id_user, 
  ftdt.TransactionId,
  ftdt.createdAt as bookingDate,
  ftd.actual_amnt,
  ft.flightName,
  ft.contactName as flightContactName
  FROM flight_transaction_dtls ftd 
  LEFT JOIN  flight_travel_dtls ft ON ftd.id_booking = ft.bookingId   
  LEFT JOIN flightTicketDtls ftdt ON ftdt.bookingId = ftd.id_booking  
  LEFT JOIN  store_user_details tud ON tud.id_user = ftd.id_user
   ${whereClause} 
   ORDER BY ftd.createdAt DESC ${filter.page_number && filter.page_size ? pagination :''}`;

  return executeQuery(query);
};

module.exports.getHotelBookingDetails = (conditions, filter) => {
  logger.info({ conditions });
  const pagination=`OFFSET (${filter.page_number} - 1) * ${filter.page_size} ROWS
  FETCH NEXT ${filter.page_size} ROWS ONLY`
  const whereClause = conditions
    ? `WHERE ${conditions} AND  ftd.status ='Booked' and  hb.bookingId  is not null`
    : " WHERE ftd.status ='Booked' and  hb.bookingId  is not null";
  const query = `SELECT  hb.hotelName,    
   hb.contact_name as hotelUserName,    
  hb.paymentStatus as hotelPaymentStatus,  
     hb.id_hotel_trip as hotelSearchId,   
       hb.noofguest as noOfGuest, 
  hb.bookingId as hotelBookingId,    
   hb.checkInDate as hotelCheckInDate,    
    hb.checkOutDate as hotelCheckOutDate, 
  hb.location_area as hotelLocation,
  hb.contact_mobile,
  hb.contact_email,
  hb.name_title,
  hb.first_name,
  hb.last_name,
  hb.hotel_address,
  tud.bank_name, 
  tud.id_user, 
  ftdt.TransactionId,
  ftdt.updatedAt as bookingDate,
  ftd.actual_amnt
  FROM flight_transaction_dtls ftd 
  LEFT JOIN  hotel_booking hb ON ftd.id_booking = hb.bookingId 
  LEFT JOIN  store_user_details tud ON tud.id_user = ftd.id_user
  LEFT JOIN hotelTicketDtls ftdt ON ftdt.bookingId = ftd.id_booking  
   ${whereClause} 
   ORDER BY ftd.createdAt DESC ${filter.page_number && filter.page_size ? pagination :''}
   `;

  return executeQuery(query);
};

