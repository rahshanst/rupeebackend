// controllers/TripController.js
const userServices = require("../services/clientservices");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const {
  GEN_SWINKPAY_ORDER_ID,
  CHECK_SWINKPAY_STATUS,
  GET_PWA_REWARDS,
  GET_PWA_WALLET_POINTS,
  DEDUCT_WALLET_POINTS,
  VALIDATE_TOKEN,
  GENERATE_SESSION_INFO,
  CHECK_SESSION_ID_IS_VALID
} = require("../apiconstants");

/*const {
  GET_PWA_REWARDS,
  GET_PWA_WALLET_POINTS,
  REFUND_POINTS,
  DEDUCT_WALLET_POINTS,
  GET_TOKEN,
  REFRESH_TOKEN,
} = require("../flightConstants");
*/
/*const getTrips = (req, res) => {
  return new Promise((resolve, reject) => {
    tripServices.getTrips().then((result) => {
      if (result[0]) {
        resolve({
          status: "200",
          data: result[0],
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getTripById = (req, res) => {
  return new Promise((resolve, reject) => {
    console.log("req.body.id", req.body.tripId);
    tripServices.getTrip(req.body.tripId).then((result) => {
      if (result[0]) {
        resolve({
          status: "200",
          data: result[0],
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: "404",
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const addTrip = (req, res) => {
  return new Promise((resolve, reject) => {
    let Trip = { ...req.body };
    tripServices.addTrip(Trip).then((result) => {
      if (result) {
        resolve({
          status: "200",
          data: result,
          message: "Data inserted Successfully",
        });
      }
      resolve({
        status: "400",
        data: result,
        message: "Unable to insert record",
      });
    });
  });
};
*/
const initiateSession =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    const ticketid = uuidv4();
    let Trip = { ticketid, ...req.body };

    // Generate an access token
    const accessToken = jwt.sign({ ticketid }, 'process.env.SECRET_KEY', {
      expiresIn: "15m",
    });

    const token= await getToken();

   // console.log({token})

    userServices.initiateSession(Trip).then((result) => {
      if (result) {
        resolve({
          status: 200,
          token: token.data,
          date: new Date(),
          isTicketBooked: false,
        });
      }
      resolve({
        status: 400,
        data: result,
        message: "Unable to insert record",
      });
      
    });
  });
};

const validateToken = function (req) {
  return new Promise(async (resolve, reject) => {
    const url = VALIDATE_TOKEN;
    const postData = req.body;
    
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const headers = {
      applicationId: req.body.applicationId,
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
    };
    try {
      let response, apiData, logData, genSessionData;
      console.log({ dd: req.body.token !== "" });
      if (req.body.GenerateSessionInfo) {
        const { bName, virtualId } = req.body;
        let sessionApiData = {
          url: GENERATE_SESSION_INFO,
          method: "POST",
          data: { bName, virtualId },
        };
        console.log({ sessionApiData: sessionApiData.data });
        genSessionData = await axios(sessionApiData);
      }
      console.log({ genSessionData });
      if (req.body.token !== "") {
        apiData = {
          url: VALIDATE_TOKEN,
          method: "POST",
          headers: authorizationHeader
            ? headers
            : {
                applicationId: req.body.applicationId,
                Authorization: `Bearer ${req.body.token}`, // Add your authorization token here
              },
          data: {},
        };
      } else {
        const { bName, virtualId, deviceType, SessionId } = req.body;
        apiData = {
          url: CHECK_SESSION_ID_IS_VALID,
          method: "POST",
          data: {
            virtualId,
            SessionId: genSessionData?.data?.sessionId
              ? genSessionData?.data?.sessionId
              : SessionId,
            bName,
            deviceType,
          },
        };
      }
      console.log(apiData);
      response = await axios(apiData);
      
      if (response.data.Errors) {
        resolve({
          status: "400",
          data: response.data,
          message: "Error while fetching details",
        });
      }

      if (req.body.token !== "") {
        resolve({
          status: response.data.status || "200",
          data: [
            {
              loginId: "",
              chegCustomerId: response.data.chegcustomerId || "",
              mobileNo: 0,
              isRegistered: true,
              token: req.body.token || "",
              refreshToken: "",
              expireDate: "",
              bankName: response.data.bankName || "",
              isReward: true,
              isRegistration: 2,
              info: "",
              emailID: "",
              type: "Bank",
              domain: null,
              roleId: 0,
              roleName: null,
              bankID: null,
              termsAndConditions:
                '<p style="margin-left:36.0pt;text-indent:-18.0pt;mso-list:l2 level1 lfo1;\ntab-stops:list 36.0pt"></p><ul style="text-align: justify; text-justify: inter-word; padding-right: 25px"><li style="text-align: justify;"><font face="Arial">Cheggout is only communicating the offer by Networks and Merchants.</font></li><li style="text-align: justify;"><font face="Arial">Cheggout will not be held liable for the usefulness, worthiness and/or character of the offer.</font></li><li style="text-align: justify;"><font>Offer is subject to availability of products at the sole discretion from the Merchant\'s side.</font></li><li style="text-align: justify;"><font>Cheggout retains the right to change or discontinue the offer at any time during the promotion period without prior notice.</font></li><li class="MsoNormal" style="text-align: justify; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">To earn Reward Points, be sure to use only the coupon codes listed on our site and shop via Cheggout to earn the Reward Points.</li><ul type="disc" style="margin-bottom: 1rem;"><li class="MsoNormal" style="text-align: justify; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">However, if you use the coupon listed on our site directly on the website or other cashback sites and claim for Reward Points from us, you will not be assigned any Points in this case.</li></ul><ul type="disc" style="margin-bottom: 1rem;"><li class="MsoNormal" style="text-align: justify; line-height: normal; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial;">Changing the Reward status to confirmed however depends on the Merchants/ Advertiser\'s validation &amp; is subject to change/ update solely from the advertiser\'s end.</li></ul><li style="text-align: justify;"><font>The offer is non-transferable, non-negotiable and has no option for encashment.</font></li><li style="text-align: justify;"><font>The decision of Cheggout will be final and binding on all and any correspondence in this regard will not be entertained.</font></li><li style="text-align: justify;"><font>Cheggout reserves the right at any time, without notice, to add/ alter/ change/ or vary any or all of these terms and conditions or to replace (entire or in part) any offer by another offer, whether similar to this offer or not, or to withdraw it altogether.</font></li><li style="text-align: justify;"><font><font style="text-indent: -24px;">Cheggout will send email notifications to the users as and when required. It can include a welcome email, offer(s) email, wallet balance or redemption email, etc. Feel free to contact support@cheggout.com for any query or feedback related to the emails&nbsp;received. If at any point of time, the user wants to unsubscribe from email notifications, please reach out to us, we respect your decision.</font><br></font></li><li style="text-align: justify;"><font>Cheggout will not be responsible or liable in case the offer is not configured or could not be availed due to malfunction, delay, traffic congestion on any telephone network or line, computer on-line system, servers or providers, computer equipment, software or website.</font></li><li style="text-align: justify;"><font>The participation in the offer is entirely voluntary and it is understood that the participation by the Cardholders shall be deemed on a voluntary basis.</font></li><li style="text-align: justify;"><font>The terms and conditions governing the offer shall be in addition to and not in substitution/ derogation to the Primary Terms and Conditions issued by Cheggout.</font></li><li style="text-align: justify;"><font>Cheggout holds out no warranty or makes no representation about the quality, delivery or otherwise of the goods and services offered/sold by the Merchant. Any dispute or claim regarding the goods and/or services must be resolved by the Cardholder directly with the Merchant without any reference to Cheggout. Additional discount offered (if any) by Cheggout is solely for promoting usage of Cheggout.</font></li><li style="text-align: justify;"><font>Images provided in promotions are only for pictorial representation and Cheggout does not undertake any liability or responsibility for the same.</font></li><li style="text-align: justify;"><font>Nothing that contains herein shall constitute or be deemed to constitute an advice, invitation, or solicitation to purchase any products/ services of Merchant or any third party and is not intended to create any rights and obligations.</font></li><li style="text-align: justify;"><font>The offer by Cheggout is subject to applicable laws and regulatory guidelines/ regulations and as per Cheggout\'s extant guidelines from time to time.</font></li><li style="text-align: justify;"><font>Cheggout shall not be liable in any manner whatsoever for any loss/ damage/ claim that may arise out of use or otherwise of any goods/ services availed by the Card Holder(s) under the offer.</font></li><li style="text-align: justify;"><font>Cheggout shall not be held liable for any delay or loss that may be caused in delivery of the goods and/or services under the offer.</font></li><li style="text-align: justify;"><font>Cheggout reserves the right to disqualify any cardholder from the benefits of the offer if any fraudulent activity is identified or being carried out for the purpose of availing the benefits under the offer or otherwise by use of the Card.</font></li><li style="text-align: justify;"><font>All taxes, duties, levies or other statutory dues and charges payable in connection with the benefits accruing under the offer shall be borne solely by the cardholder and Cheggout will not be liable in any manner whatsoever for any such taxes, duties, levies or other statutory dues.</font></li><li style="text-align: justify;"><font>The offer is not available wherever prohibited and products/ services for which such programs cannot be offered for any reason whatsoever.</font></li><li style="text-align: justify;"><font>Cheggout shall not be obliged to make any public announcements to intimate the successful Cardholders about the discount under the offer.</font></li><li style="text-align: justify;"><font>Any person taking the advantage of this offer shall be deemed to have read, understood, and accepted these terms and conditions.</font></li></ul><p></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Terms of Service&nbsp;</b></font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Introduction and Overview&nbsp;</b></font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font><span style="font-family: Arial; text-indent: -18pt; background-color: transparent;">Thank you for using the Cheggout®️ Shopping website and mobile applications, and browser extension (individually and collectively, the “Services”). The Services are provided by Cheggout Services Private Limited.&nbsp;</span></font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">The term “BANK OF BARODA” in these Terms of Service means BANK OF BARODA. and all its affiliates and subsidiaries. The terms “Cheggout” or “BANK OF BARODA Compare and Shop” or “we” or “us” or “our” in these Terms of Service means Cheggout Service Private Limited. The term “Affiliates” in these Terms of Service means companies affiliated with us through common ownership. Affiliates shall also include the parent company of the group of which we are a member and any affiliates of the parent company.&nbsp;&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">Additional service-specific terms and policies apply to some Services (“Additional Terms”), including BANK OF BARODA Shopping’s Card-Linked Offers (“CLO”) Terms, which govern your use of BANK OF BARODA Shopping’s Card-Linked Offers program (“CLO Program”) also known as Local Offers. By using such Services, including the CLO Program, you agree to be bound by the Additional Terms. Those Additional Terms are hereby incorporated herein by reference with the same force and effect as though fully set forth herein. We refer to the combination of these Terms of Service and any applicable Additional Terms collectively as these “Terms.” Our Services include our websites at cheggout.com, and any subdomains (collectively, the “Sites”), our Cheggout browser extension (the “Browser Companion”), and all related websites, networks, applications, utilities, and functions. By using any portion of our Services, you agree to these Terms. Please read them carefully.&nbsp;&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Who Can Use The Services</b></font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">You must be an individual of 18 years of age or older to use the Services, and you must enroll to use the Services using our Site or mobile application. We reserve the right to refuse access to the Services or to cancel your account at any time. By using the Services, you represent and warrant that any profile information you submit is true and accurate, that you are 18 years of age or older, and that you are fully able and competent to enter into and abide by these Terms. The Services are not intended for those under the age of 18. Use of the Services is void where prohibited. Except as otherwise expressly provided in these Terms, the Services are for personal, non-commercial use only, and you represent and warrant that you are not using the Services on behalf of any third person or entity, or for any commercial purpose. Use of the Services is limited to jurisdictions within India and is not intended for use outside of India. Limited commercial use of the Services is permitted, only as described in the next Section below, by authorized representatives of companies, entities, or other organizations namely retailers, online sellers, or merchants engaged in ecommerce (“Merchant(s)”). If you use the Services on behalf of a Merchant, then you represent and warrant that you:&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">(a) are an authorized representative of that Merchant with the authority to bind that Merchant to these Terms and&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">(b) are bound by these Terms on behalf of that Merchant.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>How the Services Work</b></font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Available Savings Monitoring</b>: We track customer policies at popular online Merchants. If we detect potential savings or refund opportunities based on your purchase history, we will either correspond with Merchants on your behalf using your name and email address to attempt to get you the benefit directly, or we will provide you with instructions on how you can contact the Merchant to obtain the benefit . Where BANK OF BARODA Compare and Shop corresponds with Merchants directly on your behalf, you authorize BANK OF BARODA Compare and Shop to act as your agent in performing this Service. BANK OF BARODA Compare and Shop does not own or control Merchants’ customer satisfaction policies, which may change at any time. For the most current version of a Merchant\'s policy, please refer to the Merchant\'s website. BANK OF BARODA Compare and Shop is not responsible for the Merchants’ actions, interpretation, and/or application of their policies, or their failure to issue a refund or other resolution that you believe is owed. BANK OF BARODA Compare and Shop may change, add, or remove eligible Merchants from our Services at any time and without any notice.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">By registering for the Services, you may be required to link your personal email account, such as Google, Yahoo! and Microsoft, and/or other Merchant accounts, such as Amazon (“Linked Accounts”) to the Services. You represent that your Linked Account belongs to you, and you are permitted to link it. You may unlink your personal email account or other Merchant accounts at any time. Unlinking an account may mean you will no longer be provided with potential refund or savings opportunity notices, but unlinking will not close your BANK OF BARODA Compare and Shop account. If you have a BANK OF BARODA account, you may also link your online profile to BANK OF BARODA Compare and Shop through “Linked Accounts”. You may unlink your BANK OF BARODA account at any time. Unlinking your BANK OF BARODA account will not close your BANK OF BARODA Compare and Shop or BANK OF BARODA account. To identify potential saving opportunities, we will review certain contents of your Linked Accounts, including receipts, correspondence, and contact information. BANK OF BARODA Compare and Shop may limit the number of monitored purchases made by registered users. We reserve the right to terminate your BANK OF BARODA Compare and Shop account for any reason, including, but not limited to, our loss of access to your inbox.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>User Accounts</b>: To use the Services, you must create a BANK OF BARODA Compare and Shop account, including a username and password (“User Account” or “Account”). The Services may allow you to register and log in using sign-on functionality provided by social networks, such as Facebook. You agree to abide by the social networks’ terms and conditions applicable to you. When registering for an Account, we need accurate and complete information about you, and you must tell us when any of your information changes. We may suspend or terminate your Account if we cannot verify your information, or if you do not update it or provide it, when requested. You are solely responsible for all activities that occur through your Account. You shall not use the Services for any illegal or unauthorized purpose. You shall not abuse, harass, threaten, harm, or impersonate other BANK OF BARODA Compare and Shop users, or BANK OF BARODA Compare and Shop employees, at any time or for any reason. You are responsible for monitoring your Account, for changing your password periodically, and for notifying BANK OF BARODA Compare and Shop immediately of any unauthorized use of your Account or breach of your password security.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">To protect your Account from unauthorized use, you shall not provide your username or password to anyone else, and you may not allow any other person or entity to access or use your Account. You shall not transmit worms, viruses, or any code of destructive nature to us, other users, or the Services. Please notify us immediately of any unauthorized use of your Account or any other breach of security by sending an email to support@cheggout.com.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Payments and Card Linking</b>: BANK OF BARODA Compare and Shop accepts payment from all major credit card networks including American Express, Discover, Visa, and Mastercard but may offer additional custom promotions and incentives upon BANK OF BARODA cards and net Banking usage. As of the “effective date of last update” stated below, access to the Services is provided to you for free.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">Any personal information that you provide to BANK OF BARODA Compare and Shop, including valid payment information, will be used solely in accordance with the Privacy Policy. As a user of the Services, you agree that you shall: (i) link your User Account or Account information with a valid credit card or other authorized payment method; and (ii) pay for all items that you request through the Services. You expressly authorize us or the applicable Payment Processor to charge the payment method you provide for any items you request through the Services. Your selection of the payment confirmation button on the applicable checkout page is your electronic signature and you agree that (a) this signature is the legal equivalent of your physical or manual signature and (b) this transaction is equivalent to an in-person transaction where your payment method is physically present.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Privacy Policy</b>: By accessing the Services, you consent to the collection and use of certain information about you, as specified in the BANK OF BARODA Compare and Shop Online &amp; Mobile Privacy Policy (the “Privacy Policy”). Our use of your Linked Accounts and all Services-related account data and personal information contained therein is governed by the Privacy Policy. BANK OF BARODA Compare and Shop encourages users of the Services to frequently check the Privacy Policy for changes. By accessing the Services, you represent and warrant that you have read and understood and agree to be bound by the Privacy Policy.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Pricing Information</b>: Except where noted otherwise, the price displayed for products made available for purchase via the Services represents the full retail price listed for the product itself. Please note that pricing information displayed on the Services is subject to change, and that we have no control over fee adjustments made by third parties, including Merchants. When shopping for products while using the Services, you will often have a choice of various shipping and return options that may be offered for different prices. We will make a reasonable effort to provide you with accurate information based on Merchant’s information with respect to inventory availability, estimated shipping dates, and product delivery timeframes, but we make no guarantees with respect to such matters.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">YOU ARE SOLELY RESPONSIBLE FOR DETERMINING AND PAYING THE APPROPRIATE GOVERNMENT TAXES, FEES, AND SERVICE CHARGES RESULTING FROM A TRANSACTION OCCURRING THROUGH THE SERVICES. WE ARE NOT RESPONSIBLE FOR COLLECTING, REPORTING, PAYING, OR REMITTING TO YOU ANY OF THOSE TAXES, FEES, OR SERVICE CHARGES, EXCEPT AS MAY OTHERWISE BE REQUIRED BY LAW. YOU ACKNOWLEDGE THAT, EXCEPT TO THE EXTENT REQUIRED BY APPLICABLE LAW, BANK OF BARODA COMPARE AND SHOP DOES NOT COLLECT TAXES FOR REMITTANCE TO APPLICABLE TAXING AUTHORITIES IN CONNECTION WITH PURCHASED PRODUCTS. THE TAX RECOVERY CHARGES ON PURCHASED PRODUCTS ARE A RECOVERY OF THE ESTIMATED SALES TAX THAT BANK OF BARODA COMPARE AND SHOP IS REQUIRED PAY TO THE APPLICABLE MERCHANT FOR TAXES DUE ON THE PURCHASED PRODUCT. THE MERCHANTS INVOICE BANK OF BARODA COMPARE AND SHOP FOR CERTAIN CHARGES, INCLUDING TAX AMOUNTS. MERCHANT SELLERS ARE RESPONSIBLE FOR REMITTING APPLICABLE TAXES TO THE APPLICABLE TAXING JURISDICTIONS. BANK OF BARODA COMPARE AND SHOP DOES NOT ACT AS A CO-VENDOR WITH THE APPLICABLE MERCHANT FOR A PARTICULAR PURCHASED PRODUCT. TAXABILITY AND THE APPROPRIATE TAX RATE VARY GREATLY BY LOCATION. THE ACTUAL TAX AMOUNTS PAID BY BANK OF BARODA COMPARE AND SHOP TO MERCHANT SELLERS MAY VARY FROM THE TAX RECOVERY CHARGE AMOUNTS, DEPENDING UPON THE RATES, DELIVERY LOCATION, TAXABILITY, ETC. IN EFFECT AT THE TIME OF THE ACTUAL SHIPMENT OF A PURCHASED PRODUCT TO YOU.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Changes</b>: BANK OF BARODA COMPARE AND SHOP RESERVES THE RIGHT TO CHANGE THESE TERMS OR THE PRIVACY POLICY AT ANY TIME. Notice of any change will be given by the posting of a new version or a change notice on the Sites. If you do not agree to the changes, you must uninstall and discontinue all access to the Services immediately. Use of the Services after the effective date of a modification constitutes your acceptance of any modified Terms or the Privacy Policy. It is your responsibility to review these Terms and the Privacy Policy periodically. If at any time you find any Terms or the Privacy Policy unacceptable, you must immediately leave all Services, and refrain from using them thereafter.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>License and Restrictions:</b> (1) You must comply with all applicable laws when using our Services. Except as may be expressly permitted by applicable law or expressly enabled by a feature of the Services, you will not, and will not permit anyone else to: (i) store, copy, modify, or distribute any of the content made available on or through the Services; (ii) compile or collect any content available on or through the Services as part of a database or other work; (iii) use any automated tool (e.g., robots, spiders) or manual process to monitor, store, copy, modify, distribute, or resell any content from the Services; (iv) frame or otherwise incorporate the Services or any portion of the Services as part of another website or a different service; (v) reproduce, duplicate, copy, sell, resell, or exploit for any commercial purposes any portion of the Services (including the display of third-party advertising); (vi) circumvent or disable any digital rights management, usage rules, or other security features of the Services, or any content available on or through the Services; (vii) use the Services in a manner that threatens the integrity, performance, or availability of the Services; (viii) remove, alter, or obscure any proprietary notices (including copyright notices) on any portion of the Services or any content available from the Services; or (ix) include any personal or identifying information about another person in your User Content (defined below) without that person’s explicit consent. (2) You are prohibited from falsely stating or otherwise misrepresenting your affiliation with any person or entity. You are prohibited from using any information obtained via the Services for any purpose other than shopping for products without the written permission of BANK OF BARODA Compare and Shop. We reserve the right to delete accounts that we determine may be associated with domains owned or operated by our competitors.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Product and Loyalty Account Information</b>: You understand and acknowledge that, through your use of the Services, you are authorizing and directing us to act on your behalf to collect and store information from third-party Merchants and loyalty program providers for which you demonstrate interest during your activities on the Internet. This information includes, (but is not limited to) product descriptions, pricing and shipping information, coupons and other discounts, and loyalty program Reward Points or other purchase incentives earned in order to retain and share that information with Merchants and other users of the Services to perform and improve the Services. If you use the functionality within the Services that allows you to share your purchase information with us, you acknowledge that information on the price you paid, whether a purchase was initiated, coupons you used, whether a coupon or coupon code is valid and effective, loyalty account details, and other details about your purchase transaction will be shared with and collected by BANK OF BARODA Compare and Shop. We may use this information to improve the Services, including by sharing the price information and coupon codes with third parties, but BANK OF BARODA Compare and Shop won’t specifically identify you to third parties when we share such information with them.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>BANK OF BARODA Compare and Shop Reward Points</b>: Generally in connection with various promotions and offers made available by us via the Services (“BANK OF BARODA Compare and Shop Promotions”), we may, from time to time, make available to you rewards offers (“BANK OF BARODA Compare and Shop Reward Points”) for completing certain actions or activities. All BANK OF BARODA Compare and Shop Reward Points are issued by BANK OF BARODA Compare and Shop in connection with our promotional, loyalty or rewards program (the “BANK OF BARODA Compare and Shop Rewards Program”). BANK OF BARODA Compare and Shop Reward Points cannot be purchased. In order to receive BANK OF BARODA Compare and Shop Reward Points, you must comply with all terms that relate to the applicable BANK OF BARODA Compare and Shop Promotion and your account must be in good standing, as defined in the Section below. BANK OF BARODA Compare and Shop Reward Points are not money or cash obligations, they do not have any monetary value, and may never be redeemed for cash or for items of monetary value outside of the Services. BANK OF BARODA Compare and Shop Reward Points may not be transferred (except as specifically provided below) or resold in any manner, including, without limitation, by means of any direct sale or auction service. You may not combine your BANK OF BARODA Compare and Shop Reward Points with BANK OF BARODA Compare and Shop Reward Points belonging to any other user, including, but not limited to, any family member or friend. BANK OF BARODA Compare and Shop Reward Points cannot be divided as part of a settlement, legal proceeding, or death.&nbsp;</font></p><p style="margin-left: 36pt; text-align: justify; text-indent: -18pt;">In order to redeem, your Reward Points have to be 250 points or more. Click on the redeem now button, you will be redirected to the Gift Card\'s page. Select the gift card of your choice based on the brand or the store (online &amp; offline), upon confirmation &amp; booking you will receive the gift card on your entered/ registered email address.&nbsp;</p><p style="margin-left: 36pt; text-align: justify; text-indent: -18pt;">In case you want to buy a gift card which is higher than your available points, you can purchase it by entering the amount &amp; paying with the help of your debit/ credit card, UPI, Net Banking etc. Upon payment &amp; confirmation you will receive it in your registered email address.&nbsp;</p><p style="margin-left: 36pt; text-align: justify; text-indent: -18pt;"><span style="font-weight: bolder;">NOTE</span>- After every successful transaction tracked by the merchants &amp; advertisers we receive the payment from them after a certain hold time- which includes the return/ replace period, payments received from the merchant. We further share it with the customers in the form of Reward Points.&nbsp;</p><p style="margin-left: 36pt; text-align: justify; text-indent: -18pt;">The average hold period that a reward point earning status goes through is 90 days. A user will go through the following status in their Reward earning section-&nbsp;<br>-&nbsp;<span style="font-weight: bolder;">Pending/ on hold</span>: this the first status a user will see when they have shopped for a product via Cheggout<br>-&nbsp;<span style="font-weight: bolder;">Approved-&nbsp;</span>Upon confirmation &amp; payment received by Cheggout &amp; shared by the customers, the status automatically changes to Approved &amp; ready for use.&nbsp;<br>-&nbsp;<span style="font-weight: bolder;">rejected/ cancelled</span>-&nbsp;When the product has been cancelled or returned, the status get updated after the end of the return period. Or, if the order does not meet the terms &amp; conditions of the advertiser/ merchant the Reward Points can get cancelled.&nbsp;&nbsp;</p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>License</b>- BANK OF BARODA Compare and Shop Reward Points obtained via the Services are provided to you under a limited, personal, revocable, non-transferable (except as specifically provided below), non-sublicensable license to use within the Services. You have no property interest, right, or title in or to any BANK OF BARODA Compare and Shop Reward Points appearing or originating in the Services or any other attributes associated with use of the Services. All BANK OF BARODA Compare and Shop Reward Points remain the sole property of BANK OF BARODA Compare and Shop.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Limitation of Liability</b>- We have no liability for hacking or loss of your BANK OF BARODA Compare and Shop Reward Points, but we will use commercially reasonable efforts to restore BANK OF BARODA Compare and Shop Reward Points in the event of any hacking or loss. We have no obligation to, and will not, reimburse you for any BANK OF BARODA Compare and Shop Reward Points or any goods or services obtained via BANK OF BARODA Compare and Shop Reward Points that are forfeited due to your violation of these Terms. We reserve the right, without prior notification, to limit the quantity of BANK OF BARODA Compare and Shop Reward Points or to refuse to provide you with any BANK OF BARODA Compare and Shop Reward Points. Price, exchangeability, and availability of BANK OF BARODA Compare and Shop Reward Points are determined by us in our sole discretion and are subject to change without notice. You agree that we have the absolute right to manage, modify, restrict, or eliminate BANK OF BARODA Compare and Shop Reward Points as we see fit in our sole discretion, and that we will have no liability for exercising that right. We are not liable to you for any damages or claims that may arise from the loss or use of your BANK OF BARODA Compare and Shop Reward Points regardless of the circumstances, specifically including (but not limited to) any damages or claims which may arise through our negligence. You absolve us of any responsibility to maintain or update your BANK OF BARODA Compare and Shop Reward Points balance, but we agree to use commercially reasonable efforts to do so. If there is a loss of BANK OF BARODA Compare and Shop Reward Points in your Account due to technical or operational problems with the Services, we may replenish the lost BANK OF BARODA Compare and Shop Reward Points once the loss has been verified. Without limiting any of the foregoing, our maximum liability or responsibility to you is to replenish the BANK OF BARODA Compare and Shop Reward Points lost.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Redemption</b>- In order to be eligible to redeem BANK OF BARODA Compare and Shop Reward Points, (1) your Account must be in good standing position; and (2) you must have accumulated a minimum of 250 Reward Points BANK OF BARODA Compare and Shop Reward Points. If you have satisfied these requirements, you may redeem BANK OF BARODA Compare and Shop Reward Points provided, however, that you may not redeem more than 2000 BANK OF BARODA Compare and Shop Reward Points in any single transaction. All redemptions of BANK OF BARODA Compare and Shop Reward Points are made with BANK OF BARODA Compare and Shop. All redemptions are subject to these Terms and all limitations and requirements stated via the Services. To the extent that there is any conflict between these Terms and any additional limitations or requirements stated via the Services, those additional limitations or requirements will control. All redemptions of BANK OF BARODA Compare and Shop Reward Points are final. Once your BANK OF BARODA Compare and Shop Reward Points have been redeemed, they will be subtracted from your BANK OF BARODA Compare and Shop Reward Points balance.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Loss of BANK OF BARODA Compare and Shop Reward Points</b>- BANK OF BARODA Compare and Shop may subtract BANK OF BARODA Compare and Shop Reward Points from your account if it determines, in its sole discretion, that you were not eligible to receive the BANK OF BARODA Compare and Shop Reward Points. If you terminate or cancel your Account, any BANK OF BARODA Compare and Shop Credit balance associated with your account will expire upon such termination or cancellation.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Good Standing</b>- To redeem BANK OF BARODA Compare and Shop Reward Points, your User Account must be in good standing, which means it cannot be terminated, suspended or otherwise in default. To remain in good standing your Account profile must remain up-to-date and your email address must remain verified. Also, if you have granted the Services access to your inbox, loss of that access can affect good standing.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Modification and Termination</b>- BANK OF BARODA Compare and Shop reserves the right to modify the terms and conditions of the BANK OF BARODA Compare and Shop Reward Points program at any time without notice, including, but not limited to, by modifying BANK OF BARODA Compare and Shop Credit redemption values, and regarding conditions for receiving or redeeming BANK OF BARODA Compare and Shop Reward Points. In addition, we may alter, change, or terminate the BANK OF BARODA Compare and Shop Rewards Program at any time without notice.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Taxes</b>- YOU HEREBY EXPRESSLY ACKNOWLEDGE AND AGREE THAT BANK OF BARODA COMPARE AND SHOP REWARD POINTS THAT YOU RECEIVE MAY BE SUBJECT TO TAX, THE PAYMENT OF WHICH IS YOUR SOLE RESPONSIBILITY. BANK OF BARODA Compare and Shop may provide you and/or the appropriate government agency or taxing authority with information related to any BANK OF BARODA Compare and Shop Reward Points you receive or redeem in connection with the Services. You agree to provide BANK OF BARODA Compare and Shop with all required information to assist BANK OF BARODA Compare and Shop in complying with its reporting or withholding obligations. BANK OF BARODA Compare and Shop may withhold any tax from any BANK OF BARODA Compare and Shop Reward Points or redemption of BANK OF BARODA Compare and Shop Reward Points as required by applicable law.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>User Content-</b> In connection with registration for an account for the Services or other use of the Services, users may post comments, product reviews, or otherwise provide information to the Services (“User Content”). You agree that you will not upload User Content to the Services unless you have created that content yourself or you have permission from the copyright owner to do so. Communications in chat areas, forums, bulletin boards, communities, product reviews, or other public or common areas of the Services are not private communications. You should use caution when submitting any User Content that contains your personal information to a public or common area of the Services. For any User Content that you upload to the Services, you grant us and our subsidiaries, affiliates, and successors: (a) a worldwide, non-exclusive, royalty-free, fully-paid, perpetual, irrevocable, transferable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, prepare derivative works of, distribute, publicly perform, and publicly display that User Content throughout the world in any media in connection with the Services and BANK OF BARODA Compare and Shop\'s business, including without limitation for promoting the Services; and (b) the right to use the name that you submit in connection with your User Content, if we choose. You retain all rights in your User Content, subject to the rights granted to BANK OF BARODA Compare and Shop in these Terms. BANK OF BARODA Compare and Shop may, in accordance with the Privacy Policy, retain in our systems and use non-personally identifiable data that is derived from your User Content. You represent and warrant that all User Content that you may post to the Services shall be your wholly original material (except for material that you are using with the permission of its owner), and does not infringe or violate any copyright, trademark or other rights of any third party including without limitation any rights of privacy or publicity. You agree not to upload to the Services or otherwise post, transmit, distribute, or disseminate through the Services any material that: (a) is false, misleading, unlawful, obscene, indecent, lewd, pornographic, defamatory, libellous, threatening, harassing, hateful, inflammatory, abusive, abusive, inflammatory; (b) encourages conduct that would be considered a criminal offense or gives rise to civil liability; (c) breaches any duty toward or rights of any person or entity, including rights of publicity or privacy; (d) contains corrupted data or any other harmful, disruptive, or destructive files; (e) advertises products or services competitive with BANK OF BARODA Compare and Shop’s or our partners’ products and services, as determined by BANK OF BARODA Compare and Shop in our sole discretion; or (f) in BANK OF BARODA Compare and Shop’s sole judgment, is objectionable, restricts or inhibits any person or entity from using or enjoying any portion of the Services, or which may expose BANK OF BARODA Compare and Shop, our affiliates, or users to harm or liability of any nature. Although BANK OF BARODA Compare and Shop has no obligation to screen, edit, or monitor any User Content, BANK OF BARODA Compare and Shop reserves the right, and has absolute discretion, to remove, screen, edit, or disable any User Content at any time and for any reason without notice. You understand that by using the Services, you may be exposed to User Content that is offensive, indecent, objectionable, or inaccurate. We take no responsibility and assume no liability for any User Content, including any loss or damage to any of your User Content.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Merchant Content-</b> If you are a user affiliated with or otherwise acting for a Merchant, you agree to permit BANK OF BARODA Compare and Shop to collect by whatever means, use, retain, store, and display information, images, text, descriptions, prices, and any other data in whatever form, that is presented on, available through, or derivable from any generally available website owned or maintained by, or otherwise associated with that Merchant (“Merchant Content”), notwithstanding any agreements, terms-of-service restrictions, or other provisions to the contrary. You represent and warrant that your use of the Services is within the scope of your duties with respect to the Merchant with which you are affiliated or associated and that you have authority to consent effectively on behalf of the Merchant to our collection, use, retention, storage, and display of any and all such Merchant Content. For any and all Merchant Content of the Merchant with which you are affiliated, you grant us and our subsidiaries, affiliates, and successors: (a) a worldwide, non-exclusive, royalty-free, fully-paid, perpetual, irrevocable, transferable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, prepare derivative works of, distribute, publicly perform, and publicly display that Merchant Content throughout the world in any media in connection with the Services and BANK OF BARODA Compare and Shop’s business, including without limitation for promoting the Services; and (b) the right to use the Merchant’s name in connection with the Merchant Content, if we choose. The applicable Merchant retains all rights in its Merchant Content, subject to the rights granted to BANK OF BARODA Compare and Shop in these Terms. Such Merchant represents and warrants that all Merchant Content that it may provide shall be its original material (except for material that such Merchant is using with the permission of its owner), and does not infringe or violate any copyright, trademark or other rights of any third party including without limitation any rights of privacy or publicity. Although BANK OF BARODA Compare and Shop has no obligation to screen, edit, or monitor any Merchant Content, BANK OF BARODA Compare and Shop reserves the right and has absolute discretion to remove, screen, edit, or disable any Merchant Content at any time and for any reason without notice.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">You understand that by using the Services, you may be exposed to Merchant Content that is offensive, indecent, objectionable, or inaccurate. We take no responsibility and assume no liability for any Merchant Content, including any loss or damage to any of Merchant Content.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Licensed Content</b>- Content on the Services, including User Content provided by other users, has been licensed to BANK OF BARODA Compare and Shop in accordance with various licensing agreements between BANK OF BARODA Compare and Shop and the persons or entities who own the rights to that content (“Licensed Content”). Licensed Content is protected by intellectual property laws. Any opinion, advice, statement, service, offer, or other information that constitutes part of the Licensed Content expressed or made available via the Services are those of the respective authors or producers and not of BANK OF BARODA Compare and Shop or our directors, officers, employees, agents, representatives, partners, or affiliates. BANK OF BARODA Compare and Shop or our directors, officers, employees, agents, representatives, partners, or affiliates will not be held liable for any loss or damage caused by your reliance on any information obtained through the Services.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Ownership and Trademarks</b>- We, our Affiliates, and our suppliers and licensors own all right, title, and interest, including all intellectual property rights, in and to the Services. Except for those rights expressly granted in these Terms, no other rights are granted, either express or implied, to you. “BANK OF BARODA Compare and Shop,” are trademarks of Cheggout. Other product, brand, and company names and logos used on the Services are the trademarks or registered trademarks of their respective owners. Any use of any of the marks appearing on the Services without the prior written consent of BANK OF BARODA Compare and Shop or the owner of the mark, as appropriate, is strictly prohibited.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Access and Modifications to the Services</b>- BANK OF BARODA Compare and Shop does not provide you with the equipment to use the Services. You are responsible for all fees charged by third parties to access and use the Services (e.g., charges by ISPs or mobile carriers).&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Customer Support</b>- You may contact Customer Service using the contact information on our Sites. The provision of customer support is not required or guaranteed and is provided at BANK OF BARODA Compare and Shop’s sole discretion.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Feedback</b>- If you provide feedback to BANK OF BARODA Compare and Shop regarding the Services, you acknowledge that the Feedback is not confidential and you authorize BANK OF BARODA Compare and Shop to use that Feedback without restriction and without payment to you. Accordingly, you hereby grant to BANK OF BARODA Compare and Shop a nonexclusive, royalty-free, fully paid, perpetual, irrevocable, transferable, and fully sublicensable right to use the Feedback in any manner and for any purpose.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Account and Services Termination</b>- We may suspend or terminate your access to the Services or your BANK OF BARODA Compare and Shop Account at any time for any reason not prohibited by law. If BANK OF BARODA Compare and Shop suspects that you have violated any provision of these Terms, BANK OF BARODA Compare and Shop may also seek any other available legal remedy. Your rights under these Terms will terminate automatically if you fail to comply with any of these Terms. Upon account termination, you must destroy or delete any copy of BANK OF BARODA Compare and Shop Software in your possession. You also may terminate your BANK OF BARODA Compare and Shop Account at any time. You may terminate your use of the Services at any time by terminating your account(s) and deleting any Software from your device or personal computer.&nbsp;</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">You remain solely liable for all obligations related to use of the Services, even after you have stopped using the Services. Neither BANK OF BARODA Compare and Shop nor any of our licensors, suppliers, or vendors is liable to you or to any third party for any loss caused by any termination of the Services or termination of your access to the Services, including any damage or loss to any data, computers, systems, or networks.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Breach of Terms</b>- BANK OF BARODA Compare and Shop may monitor the Services for violations of these Terms, and you agree (a) not to bypass monitoring, (b) that BANK OF BARODA Compare and Shop will not be liable for monitoring, and (c) nothing BANK OF BARODA Compare and Shop says or does waives our rights to monitor the Services. If BANK OF BARODA Compare and Shop determines that you have materially breached these Terms, it may, and without limiting any of our other remedies, immediately and without notice, suspend your account, terminate your account, identify you to third parties, or take legal action. You agree that you will be liable for breaches of these Terms, by you and your affiliates, consultants, agents, contractors, or employees and anyone else accessing the Services on your behalf (directly or indirectly). BANK OF BARODA Compare and Shop intends to cooperate fully with any law enforcement officials or agencies in the investigation of any violation of these Terms or of any applicable laws.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Third-Party Content</b>- The Services may contain links to Web pages and content of third parties (“Third-Party Content”), including User Content, Merchant Content, and other third-party content, as a service to those interested in this information. We do not monitor, endorse, or adopt, or have any control over any Third-Party Content. We undertake no responsibility to update or review any Third-Party Content and can make no guarantee as to its accuracy or completeness. Additionally, if you follow a link or otherwise navigate away from the Services, please be aware that you may also be subject to third-party terms and policies. You should review the applicable terms and policies, including privacy and data gathering practices, of any Third-Party Content provider to which you navigate from the Services. We make no representation or warranty as to the security of links to other websites, including Third-Party Content, nor do we make any representation or warranty as to whether such links or such other websites, including Third Party Content, are free of viruses or other forms of data corruption. In addition, we will not and cannot censor or edit Third Party Content. By using the Services, you expressly relieve us and our affiliates from all liability arising from your use of Third-Party Content. You access and use Third-Party Content at your own risk.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Promotions</b>- We may email or provide you coupons, offers, and other specials from third parties (collectively “Third-Party Promotions”). BANK OF BARODA Compare and Shop is not responsible for the redemption, errors, omissions, or expiration of Third-Party Promotions. All Third-Party Promotions featured as a part of the Services are subject to change without notice and we have no control over their legality or the ability of any merchant to complete the Third-Party Promotion (including completing the sale in accordance with the offer). The Services may contain advertisements and promotions from third parties. Your business dealings or correspondence with, or participation in promotions of, advertisers other than us, and any terms, conditions, warranties, or representations associated with those dealings, are solely between you and that third party.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Marketing</b>- Regardless of whether you have chosen to opt out of certain marketing offers from BANK OF BARODA Compare and Shop, by using the Services you agree that we may market our services and the services and products of other companies directly on our Sites through the use of banner ads, “hyper-links," and other similar marketing devices. Products offered will be at the sole discretion of BANK OF BARODA Compare and Shop and may be provided by companies not affiliated with BANK OF BARODA Compare and Shop. Non-affiliated companies will be solely responsible and liable for the provision of or failure to provide stated services, benefits, or products, and BANK OF BARODA Compare and Shop does not legally endorse or guarantee them.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Disclaimer of Warranties</b>- Your use of the services is at your sole risk. the services are provided on an “as is” and “as available” basis. BANK OF BARODA Compare and Shop, our affiliates, licensors, suppliers, and distributors expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. BANK OF BARODA Compare and Shop does not warrant uninterrupted use or operation of the services or that any data sent by or to you will be accurate, complete, transmitted in uncorrupted form, or transmitted within a reasonable amount of time. BANK OF BARODA Compare and Shop does not warrant that the services will be available at any particular time or location; that the services will be secure; that any defects or errors will be corrected; or that the services are free of viruses or other harmful components. BANK OF BARODA Compare and Shop and our affiliates, licensors, suppliers, and distributors expressly disclaim any liability for losses or other harm that you may incur through our negligence. your sole remedy in the event of any deficiency, error, or inaccuracy in the services shall be to request that BANK OF BARODA Compare and Shop correct the matter or, if BANK OF BARODA Compare and Shop fails to do so, to discontinue your use of the services. you will be solely responsible for any delay or loss of any kind that results from your access or use of the services, including loss of any loss or harm to your computer or mobile device. notwithstanding anything written or implied in the services, BANK OF BARODA Compare and Shop does not guarantee that products offered through the services will be sold at the lowest price compared to all other vendors of the same products or with the most favorable shipping and handling fees or shipment times. BANK OF BARODA Compare and Shop does not warrant, endorse, guarantee, or assume responsibility for any product or service advertised or offered by a third party through the services, and BANK OF BARODA Compare and Shop is not responsible in any way for monitoring any transaction between you and third-party providers of products or services, including any merchants or sellers. some jurisdictions may prohibit a disclaimer of implied warranties, so the above exclusion may not apply to you, and you may have other rights that vary from state to state.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Limitation of Liability</b>- The sites, browser companion, or other portions of the services may include inaccuracies or errors, including pricing errors. in particular, BANK OF BARODA Compare and Shop does not guarantee the accuracy of, and disclaims all liability for any errors or other inaccuracies relating to the information and description of the third-party products displayed in or through our services (including, without limitation, the pricing, photographs, general product descriptions, etc.), specifically including (but not limited to) any such errors or other inaccuracies resulting from our negligence. termination of your account is your sole right and remedy with respect to any dispute with BANK OF BARODA Compare and Shop regarding the services or these terms. neither BANK OF BARODA Compare and Shop nor our affiliates, licensors, suppliers, or distributors will be liable for any indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, damages to computers, systems, or networks, or other intangible losses, even if advised of the possibility of these damages, resulting from your access, use, or termination of use of the services. because some states do not allow the exclusion or limitation of liability for consequential or incidental damages, the above limitation may not apply to you.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Indemnity and Attorneys’ Fees</b>- You agree to indemnify, defend, and hold harmless BANK OF BARODA Compare and Shop, its affiliates and subsidiaries and their respective officers, directors, employees, agents, successors, assigns, and our licensors and suppliers from and against any and all losses and threatened losses, including attorney\'s fees, arising from, in connection with, or based on allegations whenever made of, any of the following: your breach of these Terms, your use of the Services, any claim that your use of the Services violates any applicable law, any claim arising out of your negligent acts or omissions, and your violation of any rights of a third party, including intellectual property rights. This obligation will survive any termination of these terms or your BANK OF BARODA Compare and Shop account. You will cooperate fully as reasonably required in defence of any claim identified under this section. You acknowledge that damages from improper use of the Services may be irreparable; therefore, BANK OF BARODA Compare and Shop is entitled to seek equitable relief in addition to all other remedies. BANK OF BARODA Compare and Shop reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by you. In the event of a dispute with BANK OF BARODA Compare and Shop arising out of or in connection with use of the Services or these Terms, you agree you will be responsible for paying BANK OF BARODA Compare and Shop’s attorneys’ fees and costs.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Laws and Regulations</b>- Your use of the Services is subject to all applicable Indian laws and regulations. Unauthorized use of the Services is prohibited, and violators can be prosecuted under central and state laws.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Dispute Resolution of Disputes Between BANK OF BARODA Compare and Shop and Merchants</b>- IF YOU ARE A MERCHANT, YOU AND BANK OF BARODA COMPARE AND SHOP AGREE THAT YOU AND BANK OF BARODA COMPARE AND SHOP MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR OUR INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. In disputes between a Merchant and BANK OF BARODA Compare and Shop, these Terms and the Indian laws will govern. Further, Indian law will govern the interpretation and application of these Terms and your use of the Services. In any dispute between a Merchant and BANK OF BARODA Compare and Shop, that action will be subject to the exclusive and mandatory jurisdiction of the courts located in India. If you are a Merchant, you hereby irrevocably submit to personal jurisdiction in the courts located in India and waive any defense of inconvenient forum.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Assignment</b>- These Terms, and any rights or licenses granted under these Terms, may not be transferred, or assigned by you, but may be assigned by BANK OF BARODA Compare and Shop without restriction. BANK OF BARODA Compare and Shop may also assign any obligation that it may have with respect to BANK OF BARODA Compare and Shop Reward Points to any other person at any time, without recourse. Any assignment attempted in violation of these Terms is void.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Waiver and Severability of Terms</b>- The failure of BANK OF BARODA Compare and Shop to exercise or enforce any right or provision of these Terms will not constitute a waiver of that right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by BANK OF BARODA Compare and Shop. If any provision of these Terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavour to give effect to the parties’ intentions as reflected in the provision, and that the other provisions of these Terms shall remain in full force and effect.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Consent to Electronic Communications-</b> By using the Services, you consent to receiving electronic communications from us. These communications may include notices about your Account and information concerning or related to the Services. You agree that any notices, agreements, disclosures, or other communications that we send to you electronically will satisfy any legal communication requirements, including that those communications be in writing. You are solely responsible for all fees charged by your telecommunications service provider or any other service provider related to your use of the Services, including without limitation any SMS / text messaging fees, data charges, and other fees.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Copyright Laws</b>- If you believe that your work has been used in a way that constitutes copyright infringement, please inform us by using our contact form. BANK OF BARODA Compare and Shop reserves the right to terminate users of its Services who are repeat infringers, as determined by BANK OF BARODA Compare and Shop in its sole discretion.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Entire Agreement-</b> These Terms (including the Additional Terms) are the entire agreement between you and BANK OF BARODA Compare and Shop regarding your use of the Services, and these Terms supersede and replace any prior agreements between BANK OF BARODA Compare and Shop and you regarding use of the Services. These Terms may not be modified orally. BANK OF BARODA Compare and Shop has no duties to you (including fiduciary duties) with respect to the Services except as expressly set forth in these Terms. the provision of information regarding products or merchants in the services or enabling purchase of products via the services is not a recommendation or endorsement of any product or merchant. You are solely responsible for compliance with any terms of use, terms of service, or other agreements or policies that govern your use of any third-party site or service of a seller that you may visit while using the services or to which you may be referred by the services.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial"><b>Third Party Beneficiaries</b>- Other than BANK OF BARODA Compare and Shop, and its affiliates, no other person or company will be third party beneficiaries to the Terms.</font></p><p style="text-align: justify; margin-left: 36pt; text-indent: -18pt;"><font face="Arial">For queries, comments, complaints, or claims related to the Services, please contact at support@cheggout.com&nbsp;</font></p>',
              isValid: null,
              bannerTime: 6,
              isDisplayEmail: true,
              isDisplayMobile: false,
              email: null,
              isNewUser: true,
            },
          ],
          message: response.data.statusText || "Data fetched Successfully",
        });
      }

      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      
      resolve({
        status: "500",
        data: [],
        error,
        message: error,
      });
    }
  });
};


const getToken = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://restapi-stage.cheggout.com/api/v1.2/RefreshToken?chegcustomerid=1682327777421000';
    console.log(url);
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Cookie,
    };
    console.log({ headers });
    try {
      const response = await axios.get(url, {
        headers,
      });
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

const getCategories = (req, res) => {
  return new Promise((resolve, reject) => {
    userServices.getCategories().then((result) => {
      console.log(result.recordset)
      if (result.recordset[0]) {
        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: 400,
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getOffers = (req, res) => {
  return new Promise((resolve, reject) => {
    userServices.getOffers().then((result) => {
      console.log("ele",result.recordset)
      if (result.recordset[0]) {
        
        result.recordset.forEach(element => {
          if(element.brand_logo){
          element.brand_logo =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.brand_logo;
          }
          
          if(element.offer_banner_lg){
            element.offer_banner_lg =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.offer_banner_lg;
            }
        });

        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      } else {
        resolve({
          status: 400,
          data: [],
          message: "Data not found.",
        });
      }
    });
  });
};

const getOfferDetails =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    let incomingData = { ...req.body };

    userServices.getOfferDetails(incomingData).then((result) => {
      if (result.recordset[0]) {

        result.recordset.forEach(element => {
          if(element.offer_banner_lg){
          element.offer_banner_lg =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.offer_banner_lg;
          }
          if(element.offer_banner_xl){
            element.offer_banner_xl =  "https://onerupee-store-api-stage.azurewebsites.net/uploads/"+element?.offer_banner_xl;
            }
        });

        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      }
      resolve({
        status: 400,
        data: [],
        message: "Unable to fetch record",
      });
      
    });
  });
};

const getCouponcode =  (req, res) => {
  return new Promise( async(resolve, reject) => {
    const user_id = 'user2';
    const coupon_code = 'dummycoupn';
    let incomingData = { user_id, coupon_code, ...req.body };

    userServices.getCouponcode(incomingData).then((result) => {
      if (result.recordset[0]) {
        resolve({
          status: 200,
          data: result.recordset,
          message: "Fetched Successfully",
        });
      }
      resolve({
        status: 400,
        data: [],
        message: "Unable to fetch coupon",
      });
      
    });
  });
};

const validationCheck = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const offer_id = req.body.offer_id;
    const postData = {
      payableAmount: 1, //parseInt(req.body.payableAmount),
      channel: "flight", //req.body.mode,
    };
    const authorizationHeader = req.headers["authorization"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };
    console.log("modeofpay:",req.body.mop)
    if(req.body.mop === 2){
    try {
    GetPWAWalletPoints(req).then((result) => {
      if(result.data?.walletPoints > 0){
        try {
        DeductWalletPoints(req).then((result) => {
          if(result.data === true){
            userServices.getCouponcode(offer_id).then((result) => {
              if (result.recordset[0]) {
                console.log(result)
                result.recordset[0].coupon_code='COUPON3THIS';
                result.recordset[0].redeem_url='https://myntra.com';
                resolve({
                  status: 200,
                  data: result.recordset,
                  message: "Fetched Successfully",
                });
              }
              resolve({
                status: 400,
                data: [],
                message: "Unable to fetch coupon",
              });
              
            });
          
          }
          else{
            resolve({
              status: 500,
              data: [],
              error,
              message: error.code,
            });
          }

        });
        }catch (error) {
          console.error("Error making API request:", error.message);
          resolve({
            status: 500,
            data: [],
            error,
            message: error.code,
          });
        }
      }
      else{
        resolve({
          status: 500,
          data: [],
          message: "Not enough wallet points!",
        });
      }
    });
    }catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
   }
   else{
    try {
      const apiData = {
        url: GEN_SWINKPAY_ORDER_ID,
        method: "post",
        headers,
        data: postData,
      };
      const response = await axios(apiData);
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
   }
  });
};

const checkPaymentStatus = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const postData = req.body;
    const authorizationHeader = req.headers["authorization"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };

    try {
      const apiData = {
        url: CHECK_SWINKPAY_STATUS,
        method: "post",
        headers,
        data: postData,
      };
      const response = await axios(apiData);
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

const GetPwaRewards = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = GET_PWA_REWARDS;
    
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, 
      Cookie,
    };
    
    try {
      const apiData = {
        url: GET_PWA_REWARDS,
        method: "get",
        headers,
      };

      const response = await axios(apiData);
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
  });
};

const GetPWAWalletPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const url = GET_PWA_WALLET_POINTS;
    
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };

    try {
      const apiData = {
        url: GET_PWA_WALLET_POINTS,
        method: "get",
        headers,
      };
      const response = await axios(apiData);
      console.log(response.data);
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.code,
      });
    }
  });
};
/*
const RefundPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const postData = {
      ...req.body,
    };
    console.log({ postData });
    console.log(url);
    console.log(req.headers);
    const authorizationHeader = req.headers["authorization"];
    // const Cookie = req.headers["Cookie"];
    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };

    try {
      const response = await axios.post(REFUND_POINTS, postData, {
        headers,
      });
      console.log(response.data);
      if (response.data.Errors) {
        resolve({
          status: "400",
          data: response.data,
          message: "Error while fetching details",
        });
      }
      resolve({
        status: "200",
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: "500",
        data: [],
        error,
        message: error.message,
      });
    }
  });
};
*/
const DeductWalletPoints = (req, res) => {
  return new Promise(async (resolve, reject) => {
    const postData = {
    rewardPoint: 1,
    title: "flight",
    };
    const url=DEDUCT_WALLET_POINTS;
    
    const authorizationHeader = req.headers["authorization"];

    const Cookie =
      "ARRAffinity=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e; ARRAffinitySameSite=ef9aa2e92a300f3166dc402f37bb3d300cbcfa0e93dee478dddb346c20cc359e";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authorizationHeader}`, // Add your authorization token here
      Cookie,
    };
    try {
      const apiData = {
        url: DEDUCT_WALLET_POINTS,
        method: "post",
        headers,
        data:postData
      };
      const response = await axios(apiData);
      console.log(response.data);
      if (response.data.Errors) {
        resolve({
          status: 400,
          data: response.data,
          message: "Error while fetching details",
        });
      }
      resolve({
        status: 200,
        data: response.data,
        message: "Data fetched Successfully",
      });
    } catch (error) {
      console.error("Error making API request:", error.message);
      resolve({
        status: 500,
        data: [],
        error,
        message: error.message,
      });
    }
  });
};

module.exports = {
 // getTrips,
 // getTripById,
 // addTrip,
  initiateSession,
  validateToken,
  getCategories,
  getOffers,
  getOfferDetails,
  getCouponcode,
  validationCheck,
  checkPaymentStatus,
  GetPwaRewards,
  GetPWAWalletPoints,
  DeductWalletPoints,
 // RefundPoints,
 // getToken,
};
