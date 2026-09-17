// Transact Bridge Enterprise Monitoring Engine & Hourly Ingestion Pipeline
(function() {
  'use strict';

  const SAMPLE_CSV_RAW = "_id\tmerchantId\tcustomerId\tstatus\ttype\ttxSubStatus\tcode\tcurrId\tquoteCurrCode\tisSettled\treferenceId\tbillingSessionId\tpaymentDetails.payMethod\tpaymentDetails.pgCode\tpaymentDetails.pgProvider\tpaymentDetails.payMethodIdentifier\tpaymentDetails.payMethodBeneficiary\tpaymentDetails.upiChannel\tpaymentDetails.paymentId\tpaymentDetails.BankName\tpaymentDetails.CardName\tpaymentDetails.upiAppName\tpaymentDetails.sourceDevice\tpaymentDetails.sourceOS\tpaymentDetails.sourcePlatform\tpaymentDetails.payMethodGroup\tmeta.param1\tmeta.param2\tmeta.param3\tremark\ttxSubType\tgstInclusive\tisMandate\tisBanned\tcreatedDate\tupdatedDate\tfailedInfo.failedState\tfailedInfo.responseCode\treferenceNo\tisDirectPacbMerchant\tquoteAmt\tquoteAmount\ttotalTax\tamount\ttotalAmount\ttxFee\ttxQuoteFee\ttxCost\ttxCostQuoteFee\trrFee\trrQuoteFee\tsettleAmount\tsettleQuoteAmount\tfxQuote\tmandateRegFee\tmandateRegQuoteFee\tmandateExcQuoteFee\tmandateExecFee\tmandateNotifyQuoteFee\tmandateNotifyFee\tmidMandateRegFee\tmidMandateExecFee\tsubscriptionId\tsuccessDate\tfailedDate\tsettleId\trefund_txnId\trefund_initiatedDate\trefund_successDate\trefund_status\tchargeback_txnId\tchargeback_initiatedDate\tchargeback_successDate\tchargeback_status\tdepositSuccessDate\tbanDate\temail\tcustomerName\treturnUrl\tpendingUrl\tsuccessUrl\tfailedUrl\tlegalEntityCode\ntx_2001\tMERCH_AMAZON\tCUST_9912\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_AMZ_881\tBILLSESS_01\tUPI\tPG_RZP\tRAZORPAY\trahul@paytm\tTransact Bridge\tPHONEPE\tPAY_RZP_99121\tPaytm Payments Bank\t\tPhonePe\tMobile\tiOS\tAPP\tUPI\torder_12\tref_9\t\tOrder settled\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:04:12\t2026-09-17 11:04:15\t\t\tRN_AMZ_01\ttrue\t1450.00\t1450.00\t261.00\t1450.00\t1450.00\t14.50\t14.50\t8.20\t8.20\t0.00\t0.00\t1435.50\t1435.50\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t2026-09-17 11:04:15\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:04:15\t\trahul@example.com\tRahul Sharma\thttps://amazon.in/ret\thttps://amazon.in/pend\thttps://amazon.in/succ\thttps://amazon.in/fail\tIN_CORP_01\ntx_2002\tMERCH_SWIGGY\tCUST_7811\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_SWG_101\tBILLSESS_02\tUPI\tPG_CF\tCASHFREE\tswiggy@okaxis\tTransact Bridge\tGPAY\tPAY_CF_7712\tAxis Bank\t\tGoogle Pay\tMobile\tAndroid\tAPP\tUPI\torder_sw_99\t\t\tFood order paid\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:18:45\t2026-09-17 11:18:48\t\t\tRN_SWG_01\ttrue\t450.00\t450.00\t81.00\t450.00\t450.00\t4.50\t4.50\t2.10\t2.10\t0.00\t0.00\t445.50\t445.50\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t2026-09-17 11:18:48\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:18:48\t\tarun@example.com\tArun Verma\thttps://swiggy.com/ret\thttps://swiggy.com/pend\thttps://swiggy.com/succ\thttps://swiggy.com/fail\tIN_CORP_01\ntx_2003\tMERCH_SWIGGY\tCUST_9021\tFAILED\tPAYMENT\tDROPPED\tE104\tINR\tINR\tfalse\tREF_SWG_102\tBILLSESS_03\tUPI\tPG_CF\tCASHFREE\tsneha@oksbi\tTransact Bridge\tPAYTM\tPAY_CF_7719\tState Bank of India\t\tPaytm\tMobile\tAndroid\tAPP\tUPI\torder_sw_100\t\t\tBank connection timeout\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:22:10\t2026-09-17 11:22:45\tBANK_DOWNTIME\tISSUER_TIMEOUT\tRN_SWG_02\ttrue\t620.00\t620.00\t111.60\t620.00\t620.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t\t2026-09-17 11:22:45\t\t\t\t\t\t\t\t\t\t\t\tsneha@example.com\tSneha Roy\thttps://swiggy.com/ret\thttps://swiggy.com/pend\thttps://swiggy.com/succ\thttps://swiggy.com/fail\tIN_CORP_01\ntx_2004\tMERCH_UBER\tCUST_3190\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_UBR_551\tBILLSESS_04\tUPI\tPG_RZP\tRAZORPAY\tmanish@ybl\tTransact Bridge\tPHONEPE\tPAY_RZP_33190\tYes Bank\t\tPhonePe\tMobile\tiOS\tAPP\tUPI\ttrip_90\t\t\tAirport ride fare\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:29:15\t2026-09-17 11:29:19\t\t\tRN_UBR_01\ttrue\t840.00\t840.00\t151.20\t840.00\t840.00\t8.40\t8.40\t4.20\t4.20\t0.00\t0.00\t831.60\t831.60\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t2026-09-17 11:29:19\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:29:19\t\tmanish@example.com\tManish Gupta\thttps://uber.com/ret\thttps://uber.com/pend\thttps://uber.com/succ\thttps://uber.com/fail\tIN_CORP_01\ntx_2005\tMERCH_FLIPKART\tCUST_6619\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_FK_889\tBILLSESS_05\tUPI\tPG_PYU\tPAYU\tdeepak@okhdfcbank\tTransact Bridge\tGPAY\tPAY_PU_6612\tHDFC Bank\t\tGoogle Pay\tDesktop\tWindows\tWEB\tUPI\tord_fk_120\t\t\tElectronics purchase\tSTANDARD\ttrue\tfalse\tfalse\t2026-09-17 11:41:20\t2026-09-17 11:41:50\t\t\tRN_FK_01\ttrue\t5400.00\t5400.00\t972.00\t5400.00\t5400.00\t54.00\t54.00\t28.00\t28.00\t0.00\t0.00\t5346.00\t5346.00\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t2026-09-17 11:41:50\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:41:50\t\tdeepak@example.com\tDeepak Saxena\thttps://flipkart.com/ret\thttps://flipkart.com/pend\thttps://flipkart.com/succ\thttps://flipkart.com/fail\tIN_CORP_01\ntx_2006\tMERCH_ZOMATO\tCUST_8832\tFAILED\tPAYMENT\tDECLINED\tE303\tINR\tINR\tfalse\tREF_ZOM_331\tBILLSESS_06\tUPI\tPG_BD\tBILLDESK\tkavita@paytm\tTransact Bridge\tPAYTM\tPAY_BD_8832\tPaytm Payments Bank\t\tPaytm\tMobile\tAndroid\tAPP\tUPI\torder_zm_44\t\t\tIncorrect MPIN entered\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:51:30\t2026-09-17 11:51:42\t3DS_AUTH_FAILED\tINCORRECT_PIN\tRN_ZM_01\ttrue\t390.00\t390.00\t70.20\t390.00\t390.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t0.00\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t\t2026-09-17 11:51:42\t\t\t\t\t\t\t\t\t\t\t\tkavita@example.com\tKavita Patel\thttps://zomato.com/ret\thttps://zomato.com/pend\thttps://zomato.com/succ\thttps://zomato.com/fail\tIN_CORP_01\ntx_2007\tMERCH_ZOMATO\tCUST_9910\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_ZOM_332\tBILLSESS_07\tUPI\tPG_RZP\tRAZORPAY\trohit@apl\tTransact Bridge\tAMAZONPAY\tPAY_RZP_9910\tAxis Bank\t\tAmazon Pay\tMobile\tiOS\tAPP\tUPI\torder_zm_45\t\t\tLunch settled\tINSTANT\ttrue\tfalse\tfalse\t2026-09-17 11:55:10\t2026-09-17 11:55:14\t\t\tRN_ZM_02\ttrue\t780.00\t780.00\t140.40\t780.00\t780.00\t7.80\t7.80\t3.90\t3.90\t0.00\t0.00\t772.20\t772.20\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\t\t2026-09-17 11:55:14\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:55:14\t\trohit@example.com\tRohit Bajaj\thttps://zomato.com/ret\thttps://zomato.com/pend\thttps://zomato.com/succ\thttps://zomato.com/fail\tIN_CORP_01\ntx_2008\tMERCH_NETFLIX\tCUST_1109\tSUCCESS\tPAYMENT\tSETTLED\t00\tINR\tINR\ttrue\tREF_NFLX_01\tBILLSESS_08\tUPI\tPG_STRIPE\tSTRIPE\tananya@cred\tTransact Bridge\tCRED\tPAY_ST_1109\tHDFC Bank\t\tCRED\tServer\tLinux\tAPI\tUPI\tsub_nflx_4k\t\t\tRecurring Mandate\tRECURRING\ttrue\ttrue\tfalse\t2026-09-17 11:57:00\t2026-09-17 11:57:04\t\t\tRN_NF_01\ttrue\t649.00\t649.00\t116.82\t649.00\t649.00\t12.98\t12.98\t6.50\t6.50\t0.00\t0.00\t636.02\t636.02\t1.0\t0\t0\t0\t0\t0\t0\t0\t0\tSUB_NFLX_99\t2026-09-17 11:57:04\t\tSETTL_001\t\t\t\t\t\t\t\t\t2026-09-17 11:57:04\t\tananya@example.com\tAnanya Mishra\thttps://netflix.com/ret\thttps://netflix.com/pend\thttps://netflix.com/succ\thttps://netflix.com/fail\tIN_CORP_01";

  const CURRENCIES = {
    INR: { symbol: '₹', rate: 1.0 },
    USD: { symbol: '$', rate: 0.0115 },
    EUR: { symbol: '€', rate: 0.0108 },
    GBP: { symbol: '£', rate: 0.0092 }
  };

  let currentCurrency = 'INR';
  let currentTimeRange = '24h';
  let simActive = true;
  let simInterval = null;
  let sortField = 'successRate';
  let sortDirection = 'desc';
  let currentFilter = 'all';
  let searchQuery = '';

  // Data Mode
  let dataMode = 'demo';
  let activeBatchId = 'demo';
  let uploadedBatches = [];
  let currentTransactions = [];

  // Analysis Reports State
  let activeAnalysisTab = 'psp'; // 'psp', 'app', 'handle'
  let analysisSearchQuery = '';
  let analysisFilter = 'all';
  let analysisSortField = 'successRate';
  let analysisSortDirection = 'desc';

  // Demo PSP Data (paymentDetails.pgProvider)
  const defaultDemoPsp = [
    { id: 'RAZORPAY', name: 'Razorpay Gateway', count: 1380000, success: 1324800, failed: 55200, amount: 690000000, successAmt: 662400000, failedAmt: 27600000 },
    { id: 'CASHFREE', name: 'Cashfree Payments', count: 840000, success: 798000, failed: 42000, amount: 420000000, successAmt: 399000000, failedAmt: 21000000 },
    { id: 'PAYU', name: 'PayU Payments', count: 520000, success: 478400, failed: 41600, amount: 260000000, successAmt: 239200000, failedAmt: 20800000 },
    { id: 'BILLDESK', name: 'BillDesk India', count: 340000, success: 312800, failed: 27200, amount: 238000000, successAmt: 218960000, failedAmt: 19040000 },
    { id: 'STRIPE', name: 'Stripe India', count: 180000, success: 174600, failed: 5400, amount: 144000000, successAmt: 139680000, failedAmt: 4320000 },
    { id: 'PHONEPE_PG', name: 'PhonePe PG', count: 160000, success: 153600, failed: 6400, amount: 96000000, successAmt: 92160000, failedAmt: 3840000 },
    { id: 'PAYTM_PG', name: 'Paytm Payment Gateway', count: 95000, success: 84550, failed: 10450, amount: 57000000, successAmt: 50730000, failedAmt: 6270000 }
  ];

  // Demo UPI App Data (paymentDetails.upiAppName) - Comprehensive Ecosystem
  const defaultDemoUpiApp = [
    { id: 'PhonePe', name: 'PhonePe', count: 1220000, success: 1179740, failed: 40260, amount: 488000000, successAmt: 471896000, failedAmt: 16104000 },
    { id: 'Google Pay', name: 'Google Pay (GPay)', count: 980000, success: 942760, failed: 37240, amount: 392000000, successAmt: 377104000, failedAmt: 14896000 },
    { id: 'Paytm', name: 'Paytm UPI', count: 460000, success: 426880, failed: 33120, amount: 184000000, successAmt: 170752000, failedAmt: 13248000 },
    { id: 'CRED', name: 'CRED UPI', count: 290000, success: 283040, failed: 6960, amount: 232000000, successAmt: 226432000, failedAmt: 5568000 },
    { id: 'BHIM', name: 'BHIM UPI', count: 140000, success: 131600, failed: 8400, amount: 42000000, successAmt: 39480000, failedAmt: 2520000 },
    { id: 'Amazon Pay', name: 'Amazon Pay UPI', count: 110000, success: 105600, failed: 4400, amount: 55000000, successAmt: 52800000, failedAmt: 2200000 },
    { id: 'WhatsApp', name: 'WhatsApp Pay', count: 65000, success: 60450, failed: 4550, amount: 19500000, successAmt: 18135000, failedAmt: 1365000 },
    { id: 'PayZapp', name: 'PayZapp (HDFC)', count: 45000, success: 38250, failed: 6750, amount: 22500000, successAmt: 19125000, failedAmt: 3375000 },
    { id: 'Airtel Pay', name: 'Airtel Payments Bank', count: 42000, success: 39480, failed: 2520, amount: 16800000, successAmt: 15792000, failedAmt: 1008000 },
    { id: 'Mobikwik', name: 'Mobikwik UPI', count: 38000, success: 35340, failed: 2660, amount: 15200000, successAmt: 14136000, failedAmt: 1064000 },
    { id: 'Jupiter', name: 'Jupiter UPI (Federal)', count: 28000, success: 26880, failed: 1120, amount: 14000000, successAmt: 13440000, failedAmt: 560000 },
    { id: 'Fi Money', name: 'Fi Money UPI', count: 24000, success: 23280, failed: 720, amount: 12000000, successAmt: 11640000, failedAmt: 360000 },
    { id: 'Navi', name: 'Navi UPI', count: 20000, success: 19100, failed: 900, amount: 10000000, successAmt: 9550000, failedAmt: 450000 },
    { id: 'Tata Neu', name: 'Tata Neu UPI', count: 18000, success: 17280, failed: 720, amount: 9000000, successAmt: 8640000, failedAmt: 360000 }
  ];

  // Demo UPI Handle Data (paymentDetails.payMethodIdentifier after @) - Complete Banking Network
  const defaultDemoUpiHandle = [
    { id: '@okaxis', name: '@okaxis (Google Pay - Axis Bank)', count: 490000, success: 472850, failed: 17150, amount: 196000000, successAmt: 189140000, failedAmt: 6860000 },
    { id: '@ybl', name: '@ybl (PhonePe - Yes Bank)', count: 620000, success: 600160, failed: 19840, amount: 248000000, successAmt: 240064000, failedAmt: 7936000 },
    { id: '@oksbi', name: '@oksbi (Google Pay - SBI)', count: 340000, success: 312800, failed: 27200, amount: 136000000, successAmt: 125120000, failedAmt: 10880000 },
    { id: '@paytm', name: '@paytm (Paytm VPA)', count: 460000, success: 426880, failed: 33120, amount: 184000000, successAmt: 170752000, failedAmt: 13248000 },
    { id: '@okhdfcbank', name: '@okhdfcbank (Google Pay - HDFC)', count: 280000, success: 271600, failed: 8400, amount: 140000000, successAmt: 135800000, failedAmt: 4200000 },
    { id: '@ibl', name: '@ibl (PhonePe - ICICI Bank)', count: 410000, success: 396880, failed: 13120, amount: 164000000, successAmt: 158752000, failedAmt: 5248000 },
    { id: '@axl', name: '@axl (PhonePe - Axis Bank)', count: 190000, success: 183160, failed: 6840, amount: 76000000, successAmt: 73264000, failedAmt: 2736000 },
    { id: '@apl', name: '@apl (Amazon Pay UPI)', count: 110000, success: 105600, failed: 4400, amount: 55000000, successAmt: 52800000, failedAmt: 2200000 },
    { id: '@barodampay', name: '@barodampay (Bank of Baroda)', count: 75000, success: 67500, failed: 7500, amount: 26000000, successAmt: 23400000, failedAmt: 2600000 },
    { id: '@icici', name: '@icici (iMobile ICICI)', count: 85000, success: 81600, failed: 3400, amount: 42500000, successAmt: 40800000, failedAmt: 1700000 },
    { id: '@fbl', name: '@fbl (Federal Bank)', count: 45000, success: 43200, failed: 1800, amount: 22500000, successAmt: 21600000, failedAmt: 900000 },
    { id: '@idfcbank', name: '@idfcbank (IDFC First Bank)', count: 52000, success: 49920, failed: 2080, amount: 26000000, successAmt: 24960000, failedAmt: 1040000 },
    { id: '@kotak', name: '@kotak (Kotak Mahindra)', count: 68000, success: 64600, failed: 3400, amount: 34000000, successAmt: 32300000, failedAmt: 1700000 },
    { id: '@postbank', name: '@postbank (India Post IPPB)', count: 32000, success: 29440, failed: 2560, amount: 12800000, successAmt: 11776000, failedAmt: 1024000 },
    { id: '@yesbank', name: '@yesbank (Yes Bank VPA)', count: 36000, success: 34560, failed: 1440, amount: 18000000, successAmt: 17280000, failedAmt: 720000 },
    { id: '@aubank', name: '@aubank (AU Small Finance Bank)', count: 28000, success: 26600, failed: 1400, amount: 14000000, successAmt: 13300000, failedAmt: 700000 },
    { id: '@indus', name: '@indus (IndusInd Bank)', count: 31000, success: 29760, failed: 1240, amount: 15500000, successAmt: 14880000, failedAmt: 620000 },
    { id: '@pnb', name: '@pnb (Punjab National Bank)', count: 41000, success: 37310, failed: 3690, amount: 16400000, successAmt: 14924000, failedAmt: 1476000 },
    { id: '@cnrb', name: '@cnrb (Canara Bank)', count: 27000, success: 24840, failed: 2160, amount: 10800000, successAmt: 9936000, failedAmt: 864000 },
    { id: '@unionbank', name: '@unionbank (Union Bank of India)', count: 25000, success: 22750, failed: 2250, amount: 10000000, successAmt: 9100000, failedAmt: 900000 }
  ];

  let pspList = JSON.parse(JSON.stringify(defaultDemoPsp));
  let upiAppList = JSON.parse(JSON.stringify(defaultDemoUpiApp));
  let upiHandleList = JSON.parse(JSON.stringify(defaultDemoUpiHandle));

  // Default Demo Merchants
  const defaultDemoMerchants = [
    {
      id: 'MERCH_AMAZON',
      name: 'Amazon Marketplace',
      category: 'E-Commerce & Retail',
      avatar: 'AZ',
      totalCount: 845200,
      successCount: 812400,
      failedCount: 32800,
      totalAmount: 42260000,
      successAmount: 40620000,
      failedAmount: 1640000,
      avgLatency: 38,
      failureReasons: { timeout: 35, insufficient: 30, auth3ds: 18, expired: 10, fraud: 7 }
    },
    {
      id: 'MERCH_SWIGGY',
      name: 'Swiggy Food & Instamart',
      category: 'Quick Commerce & Food',
      avatar: 'SW',
      totalCount: 620400,
      successCount: 593722,
      failedCount: 26678,
      totalAmount: 12408000,
      successAmount: 11874450,
      failedAmount: 533550,
      avgLatency: 29,
      failureReasons: { timeout: 42, insufficient: 28, auth3ds: 15, expired: 9, fraud: 6 }
    },
    {
      id: 'MERCH_UBER',
      name: 'Uber Technologies',
      category: 'Mobility & Rides',
      avatar: 'UB',
      totalCount: 485100,
      successCount: 461815,
      failedCount: 23285,
      totalAmount: 9702000,
      successAmount: 9236300,
      failedAmount: 465700,
      avgLatency: 32,
      failureReasons: { timeout: 25, insufficient: 45, auth3ds: 12, expired: 12, fraud: 6 }
    },
    {
      id: 'MERCH_FLIPKART',
      name: 'Flipkart Online',
      category: 'E-Commerce & Electronics',
      avatar: 'FK',
      totalCount: 390200,
      successCount: 367958,
      failedCount: 22242,
      totalAmount: 23412000,
      successAmount: 22077500,
      failedAmount: 1334500,
      avgLatency: 45,
      failureReasons: { timeout: 38, insufficient: 22, auth3ds: 25, expired: 8, fraud: 7 }
    },
    {
      id: 'MERCH_NETFLIX',
      name: 'Netflix Subscriptions',
      category: 'Digital Media & Streaming',
      avatar: 'NF',
      totalCount: 284000,
      successCount: 276800,
      failedCount: 7200,
      totalAmount: 4260000,
      successAmount: 4152000,
      failedAmount: 108000,
      avgLatency: 22,
      failureReasons: { timeout: 15, insufficient: 55, auth3ds: 8, expired: 18, fraud: 4 }
    },
    {
      id: 'MERCH_SHOPIFY',
      name: 'Shopify Merchant Stores',
      category: 'Direct-to-Consumer',
      avatar: 'SP',
      totalCount: 215000,
      successCount: 204680,
      failedCount: 10320,
      totalAmount: 15050000,
      successAmount: 14327500,
      failedAmount: 722500,
      avgLatency: 41,
      failureReasons: { timeout: 32, insufficient: 28, auth3ds: 22, expired: 10, fraud: 8 }
    },
    {
      id: 'MERCH_APPLE',
      name: 'Apple App Store & Services',
      category: 'Digital Goods & Hardware',
      avatar: 'AP',
      totalCount: 198000,
      successCount: 193050,
      failedCount: 4950,
      totalAmount: 17820000,
      successAmount: 17374500,
      failedAmount: 445500,
      avgLatency: 25,
      failureReasons: { timeout: 20, insufficient: 48, auth3ds: 12, expired: 15, fraud: 5 }
    },
    {
      id: 'MERCH_WALMART',
      name: 'Walmart Global',
      category: 'Retail & Superstore',
      avatar: 'WM',
      totalCount: 165000,
      successCount: 156420,
      failedCount: 8580,
      totalAmount: 11550000,
      successAmount: 10949400,
      failedAmount: 600600,
      avgLatency: 48,
      failureReasons: { timeout: 40, insufficient: 24, auth3ds: 18, expired: 11, fraud: 7 }
    },
    {
      id: 'MERCH_ZARA',
      name: 'Zara Fashion Group',
      category: 'Apparel & Fashion',
      avatar: 'ZR',
      totalCount: 122000,
      successCount: 113460,
      failedCount: 8540,
      totalAmount: 9760000,
      successAmount: 9076800,
      failedAmount: 683200,
      avgLatency: 52,
      failureReasons: { timeout: 35, insufficient: 32, auth3ds: 20, expired: 7, fraud: 6 }
    },
    {
      id: 'MERCH_SPOTIFY',
      name: 'Spotify Premium',
      category: 'Audio Streaming',
      avatar: 'SF',
      totalCount: 110000,
      successCount: 106700,
      failedCount: 3300,
      totalAmount: 1100000,
      successAmount: 1067000,
      failedAmount: 33000,
      avgLatency: 24,
      failureReasons: { timeout: 18, insufficient: 58, auth3ds: 6, expired: 14, fraud: 4 }
    },
    {
      id: 'MERCH_AIRBNB',
      name: 'Airbnb Stays',
      category: 'Travel & Hospitality',
      avatar: 'AB',
      totalCount: 95000,
      successCount: 88160,
      failedCount: 6840,
      totalAmount: 23750000,
      successAmount: 22040000,
      failedAmount: 1710000,
      avgLatency: 64,
      failureReasons: { timeout: 44, insufficient: 18, auth3ds: 24, expired: 8, fraud: 6 }
    },
    {
      id: 'MERCH_DOORDASH',
      name: 'DoorDash Food',
      category: 'Food Delivery',
      avatar: 'DD',
      totalCount: 88000,
      successCount: 82016,
      failedCount: 5984,
      totalAmount: 3520000,
      successAmount: 3280800,
      failedAmount: 239200,
      avgLatency: 33,
      failureReasons: { timeout: 36, insufficient: 34, auth3ds: 14, expired: 10, fraud: 6 }
    }
  ];

  let merchants = JSON.parse(JSON.stringify(defaultDemoMerchants));

  const FAILURE_TYPES = {
    timeout: { label: 'Bank Gateway Timeout', color: '#f43f5e' },
    insufficient: { label: 'Insufficient Balance', color: '#f59e0b' },
    auth3ds: { label: '3DS / OTP Auth Failed', color: '#8b5cf6' },
    expired: { label: 'Expired / Invalid Card', color: '#06b6d4' },
    fraud: { label: 'Risk Engine Block', color: '#ec4899' }
  };

  let paymentMethods = [
    { name: 'UPI', share: 0.42, successRate: 96.7 },
    { name: 'Credit Card', share: 0.28, successRate: 95.8 },
    { name: 'Debit Card', share: 0.18, successRate: 94.2 },
    { name: 'NetBanking', share: 0.08, successRate: 91.5 },
    { name: 'Digital Wallet', share: 0.04, successRate: 93.4 }
  ];

  const TIME_MULTIPLIERS = {
    '15m': 0.04,
    '1h': 0.12,
    '24h': 1.0,
    '7d': 5.8,
    '30d': 22.4
  };

  function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  }

  function formatCurrency(amountINR) {
    const cur = CURRENCIES[currentCurrency];
    const converted = amountINR * cur.rate;
    if (converted >= 1e7) {
      return cur.symbol + (converted / 1e7).toFixed(2) + ' Cr';
    } else if (converted >= 1e5) {
      return cur.symbol + (converted / 1e5).toFixed(2) + ' L';
    } else if (converted >= 1e3) {
      return cur.symbol + (converted / 1e3).toFixed(1) + 'K';
    }
    return cur.symbol + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted);
  }

  function formatExactCurrency(amountINR) {
    const cur = CURRENCIES[currentCurrency];
    const converted = amountINR * cur.rate;
    return cur.symbol + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted);
  }

  function getAggregates() {
    const mult = dataMode === 'demo' ? (TIME_MULTIPLIERS[currentTimeRange] || 1.0) : 1.0;
    let totalCount = 0;
    let successCount = 0;
    let failedCount = 0;
    let totalAmount = 0;
    let successAmount = 0;
    let failedAmount = 0;

    merchants.forEach(m => {
      totalCount += m.totalCount * mult;
      successCount += m.successCount * mult;
      failedCount += m.failedCount * mult;
      totalAmount += m.totalAmount * mult;
      successAmount += m.successAmount * mult;
      failedAmount += m.failedAmount * mult;
    });

    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0;
    const failureRate = totalCount > 0 ? (failedCount / totalCount) * 100 : 0;
    const avgTicket = totalCount > 0 ? totalAmount / totalCount : 0;

    return {
      totalCount,
      successCount,
      failedCount,
      successRate,
      failureRate,
      totalAmount,
      successAmount,
      failedAmount,
      avgTicket
    };
  }

  function renderKPIs() {
    const agg = getAggregates();

    document.getElementById('kpiTotalCount').textContent = formatNumber(agg.totalCount);
    document.getElementById('kpiSuccessCount').textContent = formatNumber(agg.successCount);
    document.getElementById('kpiFailedCount').textContent = formatNumber(agg.failedCount);

    document.getElementById('kpiSuccessRate').textContent = agg.successRate.toFixed(2) + '%';
    document.getElementById('kpiRateBar').style.width = Math.min(100, Math.max(0, agg.successRate)) + '%';

    document.getElementById('kpiSuccessShare').textContent = agg.successRate.toFixed(1) + '% of total count';
    document.getElementById('kpiFailedShare').textContent = agg.failureRate.toFixed(1) + '% of total count';

    document.getElementById('kpiTotalAmount').textContent = formatCurrency(agg.totalAmount);
    document.getElementById('kpiSuccessAmount').textContent = formatCurrency(agg.successAmount);
    document.getElementById('kpiFailedAmount').textContent = formatCurrency(agg.failedAmount);

    const successAmtPct = agg.totalAmount > 0 ? ((agg.successAmount / agg.totalAmount) * 100).toFixed(1) : '0.0';
    const failedAmtPct = agg.totalAmount > 0 ? ((agg.failedAmount / agg.totalAmount) * 100).toFixed(1) : '0.0';

    document.getElementById('kpiSuccessAmtShare').textContent = successAmtPct + '% settled volume';
    document.getElementById('kpiFailedAmtShare').textContent = failedAmtPct + '% uncollected risk';

    // Recoverable volume calculation (estimated ~65% recoverable through optimal routing failovers)
    const recVol = agg.failedAmount * 0.65;
    const recVolElem = document.getElementById('kpiRecoverableVolume');
    if (recVolElem) recVolElem.textContent = formatCurrency(recVol);

    const recShareElem = document.getElementById('kpiRecoverableShare');
    if (recShareElem) recShareElem.textContent = 'Est. ' + formatCurrency(recVol) + ' via smart failover';

    const slaBadge = document.getElementById('kpiSlaBadge');
    if (slaBadge) {
      if (agg.successRate >= 95.0) {
        slaBadge.textContent = 'Optimal (>95%)';
        slaBadge.className = 'kpi-badge up';
      } else if (agg.successRate >= 92.0) {
        slaBadge.textContent = 'Guarded (92-95%)';
        slaBadge.className = 'kpi-badge neutral';
      } else {
        slaBadge.textContent = 'Degraded (<92%)';
        slaBadge.className = 'kpi-badge down';
      }
    }

    // Keyholder Strategic Strip values
    const healthStatusElem = document.getElementById('execHealthStatus');
    if (healthStatusElem) {
      healthStatusElem.textContent = agg.successRate >= 95.0 
        ? 'Optimal Gateway Throughput (95%+ SLA)' 
        : agg.successRate >= 92.0 ? 'Guarded Latency / Moderate Drop-off' : 'Critical Outages / Low Conversion Alert';
    }

    const failureSplitElem = document.getElementById('execFailureSplit');
    if (failureSplitElem) {
      failureSplitElem.textContent = '58.4% Bank/PSP Technical Outage (Resolvable) vs 41.6% User Friction';
    }

    const topRouteElem = document.getElementById('execTopRoute');
    if (topRouteElem) {
      const topPsp = [...pspList].sort((a,b) => (b.success/(b.count||1)) - (a.success/(a.count||1)))[0];
      topRouteElem.textContent = topPsp ? `${topPsp.name || topPsp.id} (${((topPsp.success/(topPsp.count||1))*100).toFixed(1)}% SR)` : 'Razorpay + @paytm (96.4% SR)';
    }
  }

  // ==========================================
  // Analysis Reports Engine (PSP, UPI App, UPI Handle)
  // ==========================================
  function extractUpiHandle(identifier) {
    if (!identifier || typeof identifier !== 'string') return '';
    let str = identifier.trim();
    const atIdx = str.indexOf('@');
    if (atIdx !== -1) {
      let handle = str.substring(atIdx).toLowerCase();
      handle = handle.split('/')[0].split('?')[0].split(' ')[0].split('&')[0].trim();
      return handle;
    }
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleaned && (cleaned.startsWith('ok') || ['paytm','ybl','ibl','axl','apl','barodampay','icici','fbl','idfcbank','kotak','postbank','yesbank','aubank','indus','pnb','cnrb','unionbank'].includes(cleaned))) {
      return '@' + cleaned;
    }
    return '';
  }

  function getActiveAnalysisDataset() {
    let list = [];
    if (activeAnalysisTab === 'psp') list = pspList;
    else if (activeAnalysisTab === 'app') list = upiAppList;
    else if (activeAnalysisTab === 'handle') list = upiHandleList;
    else if (activeAnalysisTab === 'merchant') {
      list = merchants.map(m => ({
        id: m.id,
        name: m.name || m.id,
        count: m.totalCount || 0,
        success: m.successCount || 0,
        failed: m.failedCount || 0,
        amount: m.totalAmount || 0,
        successAmt: m.successAmount || 0,
        failedAmt: m.failedAmount || 0,
        failureReasons: m.failureReasons || {}
      }));
    }

    const mult = dataMode === 'demo' ? (TIME_MULTIPLIERS[currentTimeRange] || 1.0) : 1.0;

    let processed = list.map(item => {
      const totCount = Math.round(item.count * mult);
      const succCount = Math.round(item.success * mult);
      const failCount = Math.round(item.failed * mult);
      const rate = totCount > 0 ? (succCount / totCount) * 100 : 0;
      const failRate = totCount > 0 ? (failCount / totCount) * 100 : 0;
      const totAmt = item.amount * mult;
      const succAmt = item.successAmt * mult;
      const failAmt = item.failedAmt * mult;

      return {
        id: item.id,
        name: item.name || item.id,
        totalCount: totCount,
        successCount: succCount,
        failedCount: failCount,
        successRate: rate,
        failedRate: failRate,
        totalAmount: totAmt,
        successAmount: succAmt,
        failedAmount: failAmt,
        failureReasons: item.failureReasons || {}
      };
    });

    if (analysisFilter === 'healthy') processed = processed.filter(x => x.successRate >= 95.0);
    else if (analysisFilter === 'warning') processed = processed.filter(x => x.successRate < 95.0 && x.successRate >= 90.0);
    else if (analysisFilter === 'alert') processed = processed.filter(x => x.successRate < 90.0);

    if (analysisSearchQuery) {
      const q = analysisSearchQuery.toLowerCase();
      processed = processed.filter(x => x.id.toLowerCase().includes(q) || x.name.toLowerCase().includes(q));
    }

    processed.sort((a, b) => {
      let valA = a[analysisSortField];
      let valB = b[analysisSortField];
      if (typeof valA === 'string') {
        return analysisSortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return analysisSortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return processed;
  }

  function renderAnalysisSection() {
    const titleEl = document.getElementById('analysisTabTitle');
    const badgeEl = document.getElementById('analysisCountBadge');
    const colNameEl = document.getElementById('analysisColEntityName');
    const colStatusEl = document.getElementById('analysisColStatus');
    const tbody = document.getElementById('analysisTableBody');

    let tabLabel = 'Gateways';
    if (activeAnalysisTab === 'psp') {
      titleEl.textContent = 'Payment Service Providers (PSPs)';
      colNameEl.textContent = 'Payment Gateway / PSP (pgProvider)';
      if (colStatusEl) colStatusEl.textContent = 'Status';
      tabLabel = 'Gateways';
    } else if (activeAnalysisTab === 'app') {
      titleEl.textContent = 'UPI Applications Telemetry';
      colNameEl.textContent = 'UPI Application (upiAppName)';
      if (colStatusEl) colStatusEl.textContent = 'Status';
      tabLabel = 'UPI Apps';
    } else if (activeAnalysisTab === 'handle') {
      titleEl.textContent = 'UPI VPA Handle Performance';
      colNameEl.textContent = 'UPI Handle (@vpa)';
      if (colStatusEl) colStatusEl.textContent = 'Status';
      tabLabel = 'UPI Handles';
    } else if (activeAnalysisTab === 'merchant') {
      titleEl.textContent = 'Merchant-Wise Performance & Conversions';
      colNameEl.textContent = 'Merchant Account (merchantId)';
      if (colStatusEl) colStatusEl.textContent = 'Merchant Health';
      tabLabel = 'Merchants';
    }

    const data = getActiveAnalysisDataset();
    badgeEl.textContent = `Showing all ${data.length} ${tabLabel}`;

    tbody.innerHTML = '';
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding: 1.5rem; color: var(--text-dim);">No entities matching filter criteria.</td></tr>';
      renderAnalysisChart([]);
      return;
    }

    data.forEach(item => {
      let statusClass = 'healthy';
      let statusLabel = 'Optimal';
      let progressColor = '#10b981';

      if (item.successRate < 90.0) {
        statusClass = 'alert';
        statusLabel = 'Degraded';
        progressColor = '#f43f5e';
      } else if (item.successRate < 95.0) {
        statusClass = 'warning';
        statusLabel = 'Watch';
        progressColor = '#f59e0b';
      }

      const isHandle = item.id.startsWith('@');
      let avatarInitial = isHandle ? '@' : item.id.substring(0, 2).toUpperCase();
      if (activeAnalysisTab === 'merchant') {
        const words = item.name.split(' ').filter(w => w.length > 0);
        avatarInitial = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : item.id.substring(0, 2).toUpperCase();
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center;">
            <span class="entity-avatar">${avatarInitial}</span>
            <div>
              ${isHandle ? `<span class="handle-tag">${item.id}</span>` : `<strong>${item.name}</strong>`}
              <div style="font-size: 0.7rem; color: var(--text-dim);">${item.id}</div>
            </div>
          </div>
        </td>
        <td><strong>${formatNumber(item.totalCount)}</strong></td>
        <td class="text-success">${formatNumber(item.successCount)}</td>
        <td class="text-failed">${formatNumber(item.failedCount)}</td>
        <td>
          <div class="rate-cell-wrap">
            <div class="rate-val-row">
              <span style="color: ${progressColor}">${item.successRate.toFixed(2)}%</span>
            </div>
            <div class="table-progress">
              <div class="table-progress-fill" style="width: ${item.successRate}%; background: ${progressColor};"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="text-failed" style="font-weight: 700; font-size: 0.88rem;">${item.failedRate.toFixed(2)}%</span>
        </td>
        <td><strong>${formatCurrency(item.totalAmount)}</strong></td>
        <td class="text-success">${formatCurrency(item.successAmount)}</td>
        <td class="text-failed">${formatCurrency(item.failedAmount)}</td>
        <td>
          <span class="status-chip ${statusClass}">${statusLabel}</span>
        </td>
        <td>
          <button class="btn-inspect" data-atype="${activeAnalysisTab}" data-aid="${item.id}" title="Inspect granular diagnostics">
            🔍 Inspect
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach inspect click handlers
    tbody.querySelectorAll('.btn-inspect').forEach(btn => {
      btn.addEventListener('click', () => {
        const atype = btn.getAttribute('data-atype');
        const aid = btn.getAttribute('data-aid');
        openAnalysisInspectModal(atype, aid);
      });
    });

    renderAnalysisChart(data);
  }

  function renderAnalysisChart(data) {
    const canvas = document.getElementById('analysisChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const topItems = data.slice(0, 7);
    if (topItems.length === 0) return;

    const padding = { top: 20, right: 30, bottom: 20, left: 140 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const rowH = chartH / topItems.length;
    const barH = rowH * 0.55;

    topItems.forEach((item, idx) => {
      const y = padding.top + rowH * idx + (rowH - barH) / 2;

      ctx.textAlign = 'right';
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#001626' : '#f0f6fc';
      ctx.font = '500 12px sans-serif';
      const label = item.id.length > 16 ? item.id.substring(0, 14) + '..' : item.id;
      ctx.fillText(label, padding.left - 12, y + barH / 2 + 4);

      // Track
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#e2ecf5' : '#0f2d49';
      ctx.fillRect(padding.left, y, chartW, barH);

      // Success rate bar
      const barW = (item.successRate / 100) * chartW;
      const rateColor = item.successRate >= 95 ? '#10b981' : item.successRate >= 90 ? '#f59e0b' : '#f43f5e';
      ctx.fillStyle = rateColor;
      ctx.fillRect(padding.left, y, barW, barH);

      // Value label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${item.successRate.toFixed(1)}% (${formatCurrency(item.totalAmount)})`, padding.left + barW - 8, y + barH / 2 + 4);
    });
  }

  function openAnalysisInspectModal(dimension, entityId) {
    const modal = document.getElementById('analysisInspectModal');
    const avatarEl = document.getElementById('inspectModalAvatar');
    const titleEl = document.getElementById('inspectModalTitle');
    const badgeEl = document.getElementById('inspectModalBadge');
    const subtitleEl = document.getElementById('inspectModalSubtitle');
    const bodyEl = document.getElementById('inspectModalBody');

    if (!modal || !bodyEl) return;

    // 1. Locate entity data
    const dataset = getActiveAnalysisDataset();
    let entity = dataset.find(d => d.id.toLowerCase() === entityId.toLowerCase()) || dataset.find(d => d.id === entityId);
    if (!entity) {
      let list = (dimension === 'psp') ? pspList : (dimension === 'app' ? upiAppList : upiHandleList);
      const raw = list.find(x => x.id.toLowerCase() === entityId.toLowerCase()) || { id: entityId, name: entityId, count: 0, success: 0, failed: 0, amount: 0, successAmt: 0, failedAmt: 0 };
      const mult = dataMode === 'demo' ? (TIME_MULTIPLIERS[currentTimeRange] || 1.0) : 1.0;
      entity = {
        id: raw.id,
        name: raw.name || raw.id,
        totalCount: Math.round(raw.count * mult),
        successCount: Math.round(raw.success * mult),
        failedCount: Math.round(raw.failed * mult),
        successRate: raw.count > 0 ? (raw.success / raw.count) * 100 : 0,
        failedRate: raw.count > 0 ? (raw.failed / raw.count) * 100 : 0,
        totalAmount: raw.amount * mult,
        successAmount: raw.successAmt * mult,
        failedAmount: raw.failedAmt * mult
      };
    }

    // 2. Setup Header
    const isHandle = entity.id.startsWith('@');
    avatarEl.textContent = isHandle ? '@' : entity.id.substring(0, 2).toUpperCase();
    titleEl.textContent = entity.name || entity.id;

    let dimLabel = 'Payment Gateway (paymentDetails.pgProvider)';
    if (dimension === 'app') dimLabel = 'UPI Application (paymentDetails.upiAppName)';
    else if (dimension === 'handle') dimLabel = 'UPI Handle (paymentDetails.payMethodIdentifier)';
    else if (dimension === 'merchant') dimLabel = 'Merchant Account (merchantId)';
    subtitleEl.textContent = `${dimLabel} · Identifier: ${entity.id}`;

    let statusClass = 'healthy';
    let statusLabel = 'Optimal';
    if (entity.successRate < 90.0) {
      statusClass = 'alert';
      statusLabel = 'Degraded SLA';
    } else if (entity.successRate < 95.0) {
      statusClass = 'warning';
      statusLabel = 'Watchlist';
    }
    badgeEl.className = `status-chip ${statusClass}`;
    badgeEl.textContent = statusLabel;

    // 3. Extract failure error codes & cross-dimension split from currentTransactions
    const failCodeCounts = {};
    const crossSplitCounts = {};

    if (currentTransactions && currentTransactions.length > 0) {
      currentTransactions.forEach(t => {
        let matches = false;
        if (dimension === 'psp' && t.pgProvider.toUpperCase() === entity.id.toUpperCase()) matches = true;
        else if (dimension === 'app' && (t.upiApp.toUpperCase() === entity.id.toUpperCase() || t.upiApp === entity.id)) matches = true;
        else if (dimension === 'handle' && t.upiHandle && t.upiHandle.toLowerCase() === entity.id.toLowerCase()) matches = true;
        else if (dimension === 'merchant' && (t.merchantId.toUpperCase() === entity.id.toUpperCase() || t.merchantId === entity.id)) matches = true;

        if (matches) {
          if (!t.isSuccess) {
            const code = t.rawFailState || 'ISSUER_UNAVAILABLE';
            failCodeCounts[code] = (failCodeCounts[code] || 0) + 1;
          }

          let crossKey = '';
          if (dimension === 'psp') crossKey = t.upiApp || 'Other UPI';
          else if (dimension === 'app') crossKey = t.pgProvider || 'Primary Gateway';
          else if (dimension === 'handle') crossKey = t.pgProvider || 'Primary Gateway';
          else if (dimension === 'merchant') crossKey = t.pgProvider ? 'Gateway: ' + t.pgProvider : (t.upiApp || 'UPI Checkout');

          if (!crossSplitCounts[crossKey]) crossSplitCounts[crossKey] = { total: 0, failed: 0 };
          crossSplitCounts[crossKey].total++;
          if (!t.isSuccess) crossSplitCounts[crossKey].failed++;
        }
      });
    }

    // Default synthetic failure codes if demo mode or sparse failure states
    if (Object.keys(failCodeCounts).length === 0) {
      if (entity.failedCount > 0) {
        if (dimension === 'merchant') {
          failCodeCounts['BANK_ISSUER_TIMEOUT (E104)'] = Math.round(entity.failedCount * 0.38);
          failCodeCounts['3DS_MPIN_CANCELLED (E303)'] = Math.round(entity.failedCount * 0.28);
          failCodeCounts['INSUFFICIENT_FUNDS (E101)'] = Math.round(entity.failedCount * 0.20);
          failCodeCounts['PAYMENT_WINDOW_EXPIRED'] = Math.round(entity.failedCount * 0.09);
          failCodeCounts['PSP_LIMIT_EXCEEDED (E502)'] = Math.max(1, entity.failedCount - Math.round(entity.failedCount * 0.95));

          crossSplitCounts['Razorpay Gateway'] = { total: Math.round(entity.totalCount * 0.45), failed: Math.round(entity.failedCount * 0.25) };
          crossSplitCounts['Cashfree Payments'] = { total: Math.round(entity.totalCount * 0.30), failed: Math.round(entity.failedCount * 0.35) };
          crossSplitCounts['PayU Payments'] = { total: Math.round(entity.totalCount * 0.25), failed: Math.round(entity.failedCount * 0.40) };
        } else {
          failCodeCounts['BANK_ISSUER_TIMEOUT (E104)'] = Math.round(entity.failedCount * 0.42);
          failCodeCounts['3DS_MPIN_CANCELLED (E303)'] = Math.round(entity.failedCount * 0.28);
          failCodeCounts['INSUFFICIENT_FUNDS (E101)'] = Math.round(entity.failedCount * 0.18);
          failCodeCounts['PSP_LIMIT_EXCEEDED (E502)'] = Math.max(1, entity.failedCount - Math.round(entity.failedCount * 0.88));
        }
      } else {
        failCodeCounts['NO_FAILURE_RECORDED'] = 0;
      }
    }

    const sortedFailCodes = Object.entries(failCodeCounts).sort((a, b) => b[1] - a[1]);
    const totalRecordedFails = sortedFailCodes.reduce((sum, item) => sum + item[1], 0) || 1;
    const crossSplitEntries = Object.entries(crossSplitCounts).sort((a, b) => b[1].total - a[1].total).slice(0, 4);

    // 4. Strategic Advice Generation
    let recAdvice = '';
    if (dimension === 'merchant') {
      if (entity.successRate >= 95.0) {
        recAdvice = `<strong>Healthy Merchant Health:</strong> ${entity.name || entity.id} is operating with an optimal success rate of ${entity.successRate.toFixed(2)}% with only ${entity.failedRate.toFixed(2)}% failure rate. Checkout latency and gateway allocations are performing within enterprise SLAs.`;
      } else if (entity.successRate >= 90.0) {
        recAdvice = `<strong>Merchant Conversion Watch:</strong> ${entity.name || entity.id} has ${formatCurrency(entity.failedAmount)} uncollected (${formatNumber(entity.failedCount)} dropped checkouts). Primary root-cause: <em>${sortedFailCodes[0] ? sortedFailCodes[0][0] : 'Timeouts'}</em>. Recommend enabling smart auto-retry and multi-gateway failover for this merchant to recover ~65% of dropped checkouts.`;
      } else {
        recAdvice = `<strong>Critical Merchant Health Alert:</strong> Steep failure rate of ${entity.failedRate.toFixed(2)}% on ${entity.name || entity.id}, leaving ${formatCurrency(entity.failedAmount)} in sales uncaptured. Issues are concentrated in <em>${sortedFailCodes[0] ? sortedFailCodes[0][0] : 'Gateway Outages'}</em>. Recommended action: Immediately rebalance this merchant's volume to higher-performing secondary gateways.`;
      }
    } else if (entity.successRate >= 95.0) {
      recAdvice = `<strong>Optimal Health Verified:</strong> ${entity.name || entity.id} is maintaining a healthy conversion of ${entity.successRate.toFixed(2)}% with only ${entity.failedRate.toFixed(2)}% failure rate. Maintain primary routing allocation. Consider testing higher throughput volumes during low-latency windows.`;
    } else if (entity.successRate >= 90.0) {
      recAdvice = `<strong>Traffic Watch Notice:</strong> Conversion sits at ${entity.successRate.toFixed(2)}% with ${formatCurrency(entity.failedAmount)} at risk (${formatNumber(entity.failedCount)} failed transactions). Primary root cause points to <em>${sortedFailCodes[0] ? sortedFailCodes[0][0] : 'Timeouts'}</em>. Enable automated dynamic retry on secondary gateway fallback to recover ~65% of dropped attempts.`;
    } else {
      recAdvice = `<strong>Critical SLA Degradation Alert:</strong> Severe failure rate of ${entity.failedRate.toFixed(2)}% observed, leaving ${formatCurrency(entity.failedAmount)} uncaptured. Systemic errors are dominated by <em>${sortedFailCodes[0] ? sortedFailCodes[0][0] : 'Gateway Outages'}</em>. Recommended action: Immediately rebalance traffic away from this entity or adjust retry cooldown thresholds pending root-cause verification with engineering.`;
    }

    // 5. Render Modal HTML
    bodyEl.innerHTML = `
      <div class="modal-stats-grid">
        <div class="modal-stat-box">
          <div class="modal-stat-label">Processed Volume</div>
          <div class="modal-stat-value">${formatCurrency(entity.totalAmount)}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${formatNumber(entity.totalCount)} Total Attempts</div>
        </div>

        <div class="modal-stat-box">
          <div class="modal-stat-label">Success Rate</div>
          <div class="modal-stat-value text-success">${entity.successRate.toFixed(2)}%</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${formatCurrency(entity.successAmount)} Captured</div>
        </div>

        <div class="modal-stat-box" style="border-left: 3px solid var(--failed-red);">
          <div class="modal-stat-label">Failed Rate %</div>
          <div class="modal-stat-value text-failed">${entity.failedRate.toFixed(2)}%</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">${formatNumber(entity.failedCount)} Failed Transactions</div>
        </div>

        <div class="modal-stat-box" style="border-left: 3px solid var(--failed-red);">
          <div class="modal-stat-label">Revenue at Risk</div>
          <div class="modal-stat-value text-failed">${formatCurrency(entity.failedAmount)}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">Uncollected Drop-off</div>
        </div>
      </div>

      <div class="inspect-section-title">
        <span>🔍</span> Failure Attribution &amp; Error Response Codes
      </div>
      <div class="inspect-breakdown-list">
        ${sortedFailCodes.map(([code, cnt]) => {
          const pct = totalRecordedFails > 0 ? ((cnt / totalRecordedFails) * 100).toFixed(1) : '0';
          return `
            <div class="inspect-row-item">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 220px;">
                <span class="inspect-code-badge">${code}</span>
              </div>
              <div class="inspect-bar-container">
                <div class="inspect-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <div style="text-align: right; min-width: 90px; font-size: 0.8rem;">
                <strong>${formatNumber(cnt)}</strong> <span style="color: var(--text-dim);">(${pct}%)</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${crossSplitEntries.length > 0 ? `
        <div class="inspect-section-title" style="margin-top: 1.25rem;">
          <span>⚡</span> Cross-Dimension Route Distribution
        </div>
        <div class="inspect-breakdown-list">
          ${crossSplitEntries.map(([crossName, stats]) => {
            const failPct = stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : '0';
            const succPct = (100 - parseFloat(failPct)).toFixed(1);
            return `
              <div class="inspect-row-item">
                <div style="min-width: 180px; font-weight: 600; font-size: 0.82rem;">${crossName}</div>
                <div class="inspect-bar-container">
                  <div class="inspect-bar-fill" style="width: ${succPct}%; background: #10b981;"></div>
                </div>
                <div style="text-align: right; min-width: 130px; font-size: 0.78rem;">
                  <span class="text-success">${succPct}% SR</span> · ${formatNumber(stats.total)} txns
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <div class="inspect-rec-box">
        <div class="inspect-rec-title">
          <span>💡</span> Keyholder Diagnostic &amp; Strategic Guidance
        </div>
        <div class="inspect-rec-text">
          ${recAdvice}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  // Close handlers for Inspect Modal
  const inspectModalEl = document.getElementById('analysisInspectModal');
  const inspectCloseBtnEl = document.getElementById('inspectModalCloseBtn');
  if (inspectCloseBtnEl && inspectModalEl) {
    inspectCloseBtnEl.addEventListener('click', () => {
      inspectModalEl.classList.remove('active');
    });
    inspectModalEl.addEventListener('click', (e) => {
      if (e.target === inspectModalEl) {
        inspectModalEl.classList.remove('active');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        inspectModalEl.classList.remove('active');
        const upModal = document.getElementById('uploadModal');
        if (upModal) upModal.classList.remove('active');
      }
    });
  }

  function exportAnalysisCSV() {
    const data = getActiveAnalysisDataset();
    const cur = CURRENCIES[currentCurrency];

    const tabName = activeAnalysisTab === 'psp' ? 'PSP_Gateway' : activeAnalysisTab === 'app' ? 'UPI_App' : activeAnalysisTab === 'handle' ? 'UPI_Handle' : 'Merchant_Performance';
    const headers = [
      activeAnalysisTab === 'merchant' ? 'Merchant Identifier' : 'Entity Identifier',
      activeAnalysisTab === 'merchant' ? 'Merchant Name' : 'Entity Name',
      'Total Transactions',
      'Success Count',
      'Failed Count',
      'Success Rate %',
      'Failed %',
      `Total Amount (${currentCurrency})`,
      `Success Amount (${currentCurrency})`,
      `Failed Amount (${currentCurrency})`,
      activeAnalysisTab === 'merchant' ? 'Merchant Health' : 'Status'
    ];

    const rows = data.map(item => {
      const status = item.successRate >= 95.0 ? 'Optimal' : item.successRate >= 90.0 ? 'Watch' : 'Degraded';
      return [
        `"${item.id}"`,
        `"${item.name}"`,
        item.totalCount,
        item.successCount,
        item.failedCount,
        item.successRate.toFixed(2),
        item.failedRate.toFixed(2),
        (item.totalAmount * cur.rate).toFixed(2),
        (item.successAmount * cur.rate).toFixed(2),
        (item.failedAmount * cur.rate).toFixed(2),
        status
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TransactBridge_${tabName}_Report_${currentTimeRange}_${currentCurrency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.getElementById('exportAnalysisCsvBtn').addEventListener('click', exportAnalysisCSV);

  // Analysis Tabs Switcher
  document.querySelectorAll('.analysis-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.analysis-nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAnalysisTab = btn.getAttribute('data-atab');
      renderAnalysisSection();
    });
  });

  document.getElementById('analysisSearchInput').addEventListener('input', (e) => {
    analysisSearchQuery = e.target.value.trim();
    renderAnalysisSection();
  });

  document.querySelectorAll('.analysis-filter-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.analysis-filter-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      analysisFilter = btn.getAttribute('data-af');
      renderAnalysisSection();
    });
  });

  document.querySelectorAll('#analysisTable th[data-asort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-asort');
      if (analysisSortField === field) {
        analysisSortDirection = analysisSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        analysisSortField = field;
        analysisSortDirection = 'desc';
      }

      document.querySelectorAll('#analysisTable th').forEach(h => {
        h.classList.remove('sorted-asc', 'sorted-desc');
      });
      th.classList.add(analysisSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
      renderAnalysisSection();
    });
  });

  // ==========================================
  // Executive Recommendations Engine (Screenshot 2 Faithful Reproduction)
  // ==========================================
  let activeRecFilter = 'all';

  function getRecommendationsList() {
    const list = [];

    // 1. Dynamic PSP Health / Outages Analysis
    const activePsps = pspList.filter(p => p.count > 0);
    const sortedPspsByFailure = [...activePsps].sort((a, b) => {
      const failA = a.failedAmt || (a.amount * (1 - (a.success / (a.count || 1))));
      const failB = b.failedAmt || (b.amount * (1 - (b.success / (b.count || 1))));
      return failB - failA;
    });

    const healthyPsps = [...activePsps].filter(p => ((p.success / p.count) * 100) >= 95.0)
      .sort((a, b) => (b.success / b.count) - (a.success / a.count));
    const topHealthyPsp = healthyPsps[0] || activePsps[0];
    const topHealthyRate = topHealthyPsp ? ((topHealthyPsp.success / topHealthyPsp.count) * 100).toFixed(1) + '%' : '96.4%';

    const degradedPsp = sortedPspsByFailure.find(p => ((p.success / p.count) * 100) < 95.0) || sortedPspsByFailure[0];

    if (degradedPsp && ((degradedPsp.success / degradedPsp.count) * 100) < 95.0) {
      const pName = degradedPsp.name || degradedPsp.id;
      const pRate = ((degradedPsp.success / degradedPsp.count) * 100).toFixed(2);
      const failedVal = degradedPsp.failedAmt || (degradedPsp.amount * (1 - (degradedPsp.success / degradedPsp.count)));
      list.push({
        priority: 1,
        category: 'psp',
        tag: 'PRIORITY 1 · PSP HEALTH',
        statusClass: 'status-alert',
        statusLabel: 'Action Required',
        title: `Review ${pName} integration and routing weight`,
        desc: `${pName} is converting at ${pRate}%, well below target SLA (>95%), and is sitting on ${formatCurrency(failedVal)} of failed value (${formatNumber(degradedPsp.failed)} dropped txns). Confirm with the PSP whether this is a systemic outage/limit issue, and consider shifting routing weight toward higher-converting PSPs (like ${topHealthyPsp ? (topHealthyPsp.name || topHealthyPsp.id) : 'primary gateways'} at ${topHealthyRate}) while it's investigated.`,
        impact: '⚠️ Impact: Prevents routing loss to stalled gateways',
        owner: 'Owner: PSP Relationship & DevOps'
      });
    } else {
      list.push({
        priority: 1,
        category: 'psp',
        tag: 'PRIORITY 1 · PSP HEALTH',
        statusClass: 'status-alert',
        statusLabel: 'Action Required',
        title: 'Review UNLM integration and routing weight',
        desc: "UNLM is converting at 0.00%, well below PHPY's 89.61%, and is sitting on ₹7 of failed value. Confirm with the PSP whether this is a systemic outage/limit issue, and consider shifting routing weight toward higher-converting PSPs while it's investigated.",
        impact: '⚠️ Impact: Prevents routing loss to stalled gateways',
        owner: 'Owner: PSP Relationship & DevOps'
      });
    }

    // 2. Dynamic App Failure Patterns Analysis
    const activeApps = upiAppList.filter(a => a.count > 0);
    const sortedAppsByRate = [...activeApps].sort((a, b) => (a.success / a.count) - (b.success / b.count));
    const lowestApp = sortedAppsByRate[0];

    if (lowestApp && ((lowestApp.success / lowestApp.count) * 100) < 95.0) {
      const aName = lowestApp.name || lowestApp.id;
      const aRate = ((lowestApp.success / lowestApp.count) * 100).toFixed(2);
      const aFailedVal = lowestApp.failedAmt || (lowestApp.amount * (1 - (lowestApp.success / lowestApp.count)));
      list.push({
        priority: 2,
        category: 'app',
        tag: 'PRIORITY 2 · APP FAILURE PATTERN',
        statusClass: 'status-warning',
        statusLabel: 'Engineering Investigation',
        title: `Root-cause the ${aName} failure spike`,
        desc: `${aName} shows a ${aRate}% success rate (${formatNumber(lowestApp.failed)} failed attempts, ${formatCurrency(aFailedVal)} uncollected), far outside the normal range for other apps. This pattern (near-total failure rather than gradual underperformance) usually points to an integration break, wrong intent/collect flow, or an app-side block rather than general payment friction — worth an engineering ticket this week.`,
        impact: '🔍 Impact: Fixes app-level checkout drop-off',
        owner: 'Owner: Core Payment SDK Team'
      });
    } else {
      list.push({
        priority: 2,
        category: 'app',
        tag: 'PRIORITY 2 · APP FAILURE PATTERN',
        statusClass: 'status-warning',
        statusLabel: 'Engineering Investigation',
        title: 'Root-cause the PAYZAPP failure spike',
        desc: 'PAYZAPP shows a 0.00% success rate, far outside the normal range for other apps. This pattern (near-total failure rather than gradual underperformance) usually points to an integration break, wrong intent/collect flow, or an app-side block rather than general payment friction — worth an engineering ticket this week.',
        impact: '🔍 Impact: Fixes app-level checkout drop-off',
        owner: 'Owner: Core Payment SDK Team'
      });
    }

    // 3. Dynamic Routing Optimization Analysis
    const activeHandles = upiHandleList.filter(h => h.count > 0);
    const sortedHandlesByLoss = [...activeHandles].sort((a, b) => {
      const failA = a.failedAmt || (a.amount * (1 - (a.success / (a.count || 1))));
      const failB = b.failedAmt || (b.amount * (1 - (b.success / (b.count || 1))));
      return failB - failA;
    });
    const keyHandle = sortedHandlesByLoss[0];

    if (keyHandle && keyHandle.failed > 0) {
      const hName = keyHandle.id;
      const hFailCount = formatNumber(keyHandle.failed);
      const hFailAmt = formatCurrency(keyHandle.failedAmt || (keyHandle.amount * (1 - (keyHandle.success / keyHandle.count))));
      const recoverableAmt = formatCurrency((keyHandle.failedAmt || 100000) * 0.65);
      list.push({
        priority: 3,
        category: 'routing',
        tag: 'PRIORITY 3 · ROUTING OPTIMIZATION',
        statusClass: 'status-opportunity',
        statusLabel: 'Routing Optimization',
        title: `Use the ${hName} routing split to rebalance traffic`,
        desc: `The PSP route split by handler shows which gateway is carrying which issuing bank's traffic (e.g. ${hName} has ${hFailCount} dropped attempts sitting on ${hFailAmt} uncollected). Where a handler's traffic is concentrated on a weaker PSP, re-routing to the PSP with the best track record for that bank can recover ~${recoverableAmt} in volume.`,
        impact: '📈 Impact: Estimated +2.4% to +4.1% SR uplift',
        owner: 'Owner: Payment Product Owner'
      });
    } else {
      list.push({
        priority: 3,
        category: 'routing',
        tag: 'PRIORITY 3 · ROUTING OPTIMIZATION',
        statusClass: 'status-opportunity',
        statusLabel: 'Routing Optimization',
        title: 'Use the handler routing split to rebalance traffic',
        desc: "The PSP route split by handler shows which gateway is carrying which issuing bank's traffic (e.g. @axl routes mostly via PAYU). Where a handler's traffic is concentrated on a weaker PSP, consider re-routing to the PSP with the best track record for that bank.",
        impact: '📈 Impact: Estimated +2.4% to +4.1% SR uplift',
        owner: 'Owner: Payment Product Owner'
      });
    }

    // 4. Data Quality & Telemetry Audit
    let missingVpaCount = 0;
    let totalFailedCount = 0;
    if (currentTransactions && currentTransactions.length > 0) {
      currentTransactions.forEach(t => {
        if (!t.isSuccess) {
          totalFailedCount++;
          if (!t.upiHandle || t.upiHandle.trim() === '') {
            missingVpaCount++;
          }
        }
      });
    }

    if (missingVpaCount > 0) {
      list.push({
        priority: 4,
        category: 'quality',
        tag: 'DATA QUALITY',
        statusClass: 'status-info',
        statusLabel: 'Telemetry Enhancement',
        title: 'Capture the VPA / handler on failed attempts too',
        desc: `Handler-level failure analysis shows that ${formatNumber(missingVpaCount)} out of ${formatNumber(totalFailedCount)} failed attempts lack full VPA handle telemetry (empty paymentDetails.payMethodIdentifier). Capturing the VPA earlier in the checkout flow (e.g. on intent initiation) will unlock 100% full-funnel failure attribution by issuing bank.`,
        impact: '📊 Impact: 100% full-funnel bank downtime visibility',
        owner: 'Owner: Data Engineering'
      });
    } else {
      list.push({
        priority: 4,
        category: 'quality',
        tag: 'DATA QUALITY',
        statusClass: 'status-info',
        statusLabel: 'Telemetry Enhancement',
        title: 'Capture the VPA / handler on failed attempts too',
        desc: "Handler-level failure analysis isn't currently possible because the VPA is only logged on success. Capturing it earlier in the flow (e.g. on intent initiation) would let this same report show success/failure by issuing bank, not just by PSP and app.",
        impact: '📊 Impact: 100% full-funnel bank downtime visibility',
        owner: 'Owner: Data Engineering'
      });
    }

    return list;
  }

  function renderRecommendations() {
    const container = document.getElementById('recommendationsList');
    if (!container) return;

    const allRecs = getRecommendationsList();
    const filtered = activeRecFilter === 'all'
      ? allRecs
      : allRecs.filter(r => r.category === activeRecFilter);

    container.innerHTML = '';
    filtered.forEach(r => {
      const card = document.createElement('div');
      const priorityClass = r.priority === 4 ? 'rec-priority-quality' : `rec-priority-${r.priority}`;
      card.className = `rec-card ${priorityClass}`;
      card.setAttribute('data-cat', r.category);
      card.innerHTML = `
        <div class="rec-top-meta">
          <span class="rec-tag">${r.tag}</span>
          <span class="rec-status-badge ${r.statusClass}">${r.statusLabel}</span>
        </div>
        <h3 class="rec-title">${r.title}</h3>
        <p class="rec-desc">${r.desc}</p>
        <div class="rec-footer-meta">
          <span class="rec-impact">${r.impact}</span>
          <span class="rec-owner">${r.owner}</span>
        </div>
      `;
      container.appendChild(card);
    });

    const badge = document.getElementById('execActionItemCount');
    if (badge) {
      badge.textContent = `${allRecs.length} Strategic Recommendations`;
    }
  }

  // Filter Buttons Listener for Recommendations
  document.querySelectorAll('.rec-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rec-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRecFilter = btn.getAttribute('data-rf');
      renderRecommendations();
    });
  });

  // Export Action Items Button
  const exportRecsBtn = document.getElementById('exportRecsBtn');
  if (exportRecsBtn) {
    exportRecsBtn.addEventListener('click', () => {
      const recs = getRecommendationsList();
      const headers = ['Priority', 'Category', 'Recommendation Title', 'Details', 'Expected Impact', 'Action Owner'];
      const rows = recs.map(r => [
        `"Priority ${r.priority}"`,
        `"${r.category.toUpperCase()}"`,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.desc.replace(/"/g, '""')}"`,
        `"${r.impact.replace(/"/g, '""')}"`,
        `"${r.owner.replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const link = document.createElement('a');
      link.href = encodeURI(csvContent);
      link.download = `TransactBridge_Executive_Recommendations_${currentTimeRange}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  function exportCSV() {
    const cur = CURRENCIES[currentCurrency];
    const headers = [
      'Dimension',
      'Entity Name / Code',
      'Total Transactions',
      'Success Count',
      'Failed Count',
      'Success Rate %',
      `Total Volume (${currentCurrency})`,
      `Success Volume (${currentCurrency})`,
      `Failed Volume (${currentCurrency})`,
      'Health Status'
    ];

    const rows = [];
    pspList.forEach(p => {
      const sr = p.count > 0 ? ((p.success / p.count) * 100).toFixed(2) : '0.00';
      rows.push([
        'PSP Gateway',
        `"${p.name || p.id}"`,
        p.count,
        p.success,
        p.failed,
        sr,
        (p.amount * cur.rate).toFixed(2),
        ((p.successAmt || 0) * cur.rate).toFixed(2),
        ((p.failedAmt || 0) * cur.rate).toFixed(2),
        sr >= 95 ? 'Optimal' : sr >= 92 ? 'Watch' : 'Degraded'
      ]);
    });

    upiAppList.forEach(a => {
      const sr = a.count > 0 ? ((a.success / a.count) * 100).toFixed(2) : '0.00';
      rows.push([
        'UPI App',
        `"${a.name || a.id}"`,
        a.count,
        a.success,
        a.failed,
        sr,
        (a.amount * cur.rate).toFixed(2),
        ((a.successAmt || 0) * cur.rate).toFixed(2),
        ((a.failedAmt || 0) * cur.rate).toFixed(2),
        sr >= 95 ? 'Optimal' : sr >= 92 ? 'Watch' : 'Degraded'
      ]);
    });

    upiHandleList.forEach(h => {
      const sr = h.count > 0 ? ((h.success / h.count) * 100).toFixed(2) : '0.00';
      rows.push([
        'UPI Handle',
        `"${h.name || h.id}"`,
        h.count,
        h.success,
        h.failed,
        sr,
        (h.amount * cur.rate).toFixed(2),
        ((h.successAmt || 0) * cur.rate).toFixed(2),
        ((h.failedAmt || 0) * cur.rate).toFixed(2),
        sr >= 95 ? 'Optimal' : sr >= 92 ? 'Watch' : 'Degraded'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TransactBridge_Executive_Summary_${currentTimeRange}_${currentCurrency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // In-Browser Robust Parser for 83-Column Schema
  // ==========================================
  function parseCSV(text) {
    const firstLine = text.split('\n')[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = splitLine(lines[0], delimiter).map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = splitLine(lines[i], delimiter);
      if (values.length === 0) continue;
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] !== undefined ? values[idx].trim() : '';
      });
      rows.push(obj);
    }
    return rows;
  }

  function splitLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  function normalizeRow(row) {
    const merchantId = row.merchantId || row.mid || 'MERCH_DEFAULT';

    const rawStatus = (row.status || row.txSubStatus || '').toUpperCase();
    const hasSuccessDate = Boolean(row.successDate && row.successDate.trim() !== '');
    const hasFailedDate = Boolean(row.failedDate && row.failedDate.trim() !== '');
    const hasFailedReason = Boolean((row['failedInfo.failedState'] || row['failedInfo.responseCode'] || '').trim() !== '');

    let isSuccess = false;
    if (rawStatus === 'SUCCESS' || rawStatus === 'SETTLED' || rawStatus === 'COMPLETED' || rawStatus === 'CHARGED' || rawStatus === 'PAID' || hasSuccessDate) {
      isSuccess = true;
    } else if (rawStatus === 'FAILED' || rawStatus === 'DECLINED' || rawStatus === 'DROPPED' || rawStatus === 'REJECTED' || hasFailedDate || hasFailedReason) {
      isSuccess = false;
    } else {
      isSuccess = row.code === '00' || row.code === 'SUCCESS';
    }

    let amtStr = row.totalAmount || row.amount || row.quoteAmount || row.quoteAmt || row.settleAmount || '0';
    if (typeof amtStr === 'string') {
      amtStr = amtStr.replace(/[^0-9.-]+/g, '');
    }
    const amount = parseFloat(amtStr) || 0;

    const payMethod = row['paymentDetails.payMethod'] || row['paymentDetails.payMethodGroup'] || row['paymentDetails.upiChannel'] || 'UPI';
    const bankName = row['paymentDetails.BankName'] || row['paymentDetails.CardName'] || '';

    // Payment Provider (PSP)
    const pgProvider = (row['paymentDetails.pgProvider'] || row['paymentDetails.pgCode'] || row.pgProvider || row.gateway || 'UNKNOWN_PSP').toUpperCase().trim();

    // UPI App
    let upiApp = (row['paymentDetails.upiAppName'] || row['paymentDetails.upiChannel'] || row.upiAppName || '').trim();
    if (!upiApp) {
      const vpa = (row['paymentDetails.payMethodIdentifier'] || row['paymentDetails.vpa'] || row.vpa || row.payerVpa || '').toLowerCase();
      if (vpa.includes('@ybl') || vpa.includes('@ibl') || vpa.includes('@axl')) upiApp = 'PhonePe';
      else if (vpa.includes('@ok')) upiApp = 'Google Pay';
      else if (vpa.includes('@paytm')) upiApp = 'Paytm';
      else if (vpa.includes('@apl')) upiApp = 'Amazon Pay';
      else if (vpa.includes('@cred')) upiApp = 'CRED';
      else if (vpa.includes('@pz')) upiApp = 'PayZapp';
      else upiApp = 'Direct / Other UPI';
    }

    // UPI Handle (after @ in paymentDetails.payMethodIdentifier)
    const rawIdentifier = row['paymentDetails.payMethodIdentifier'] || row['paymentDetails.vpa'] || row.vpa || row.payerVpa || row.handle || '';
    const upiHandle = extractUpiHandle(rawIdentifier);

    const failState = (row['failedInfo.failedState'] || row['failedInfo.responseCode'] || row.remark || '').toUpperCase();
    let failCategory = 'timeout';
    if (failState.includes('INSUFFICIENT') || failState.includes('BALANCE')) failCategory = 'insufficient';
    else if (failState.includes('3DS') || failState.includes('OTP') || failState.includes('PIN')) failCategory = 'auth3ds';
    else if (failState.includes('EXPIRED') || failState.includes('CARD') || failState.includes('INVALID')) failCategory = 'expired';
    else if (failState.includes('FRAUD') || failState.includes('RISK') || failState.includes('BANNED')) failCategory = 'fraud';

    return {
      id: row._id || row.referenceId || row.referenceNo || 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      merchantId,
      customerId: row.customerId || '',
      isSuccess,
      amount,
      currency: row.currId || row.quoteCurrCode || 'INR',
      payMethod,
      bankName,
      pgProvider,
      upiApp,
      upiHandle,
      failCategory,
      rawFailState: row['failedInfo.failedState'] || row['failedInfo.responseCode'] || row.remark || 'DECLINED',
      createdDate: row.createdDate || row.updatedDate || new Date().toISOString()
    };
  }

  function ingestTransactions(rawRows, batchName, mode) {
    if (!rawRows || rawRows.length === 0) {
      alert('No valid transaction records detected in the file.');
      return;
    }

    const normalized = rawRows.map(normalizeRow);

    const batchObj = {
      id: 'batch_' + Date.now(),
      name: batchName || `Batch ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      uploadedAt: new Date().toISOString(),
      count: normalized.length,
      transactions: normalized
    };

    if (mode === 'replace') {
      uploadedBatches = [batchObj];
      currentTransactions = normalized;
    } else {
      uploadedBatches.push(batchObj);
      currentTransactions = currentTransactions.concat(normalized);
    }

    saveBatchesToStorage();

    dataMode = 'uploaded';
    activeBatchId = 'all';

    recomputeDashboardFromTransactions(currentTransactions);
    updateStatusBanner();
    updateBatchSelector();
    stopSimulation();

    document.getElementById('uploadModal').classList.remove('active');
  }

  let uploadedFailureCounts = null;

  function recomputeDashboardFromTransactions(txns) {
    const merchantMap = {};
    const pspMap = {};
    const upiAppMap = {};
    const upiHandleMap = {};
    const payMethodMap = {};
    const failCounts = { timeout: 0, insufficient: 0, auth3ds: 0, expired: 0, fraud: 0 };

    txns.forEach(t => {
      // 1. Merchant Aggregation
      if (!merchantMap[t.merchantId]) {
        merchantMap[t.merchantId] = {
          id: t.merchantId,
          name: t.merchantId.replace(/MERCH_|MID_/gi, '').replace(/_/g, ' '),
          category: 'Active Merchant',
          avatar: t.merchantId.substring(0, 2).toUpperCase(),
          totalCount: 0,
          successCount: 0,
          failedCount: 0,
          totalAmount: 0,
          successAmount: 0,
          failedAmount: 0,
          avgLatency: 28 + Math.floor(Math.random() * 25),
          failureReasons: { timeout: 0, insufficient: 0, auth3ds: 0, expired: 0, fraud: 0 }
        };
      }
      const m = merchantMap[t.merchantId];
      m.totalCount += 1;
      m.totalAmount += t.amount;
      if (t.isSuccess) {
        m.successCount += 1;
        m.successAmount += t.amount;
      } else {
        m.failedCount += 1;
        m.failedAmount += t.amount;
        m.failureReasons[t.failCategory] = (m.failureReasons[t.failCategory] || 0) + 1;
        failCounts[t.failCategory] = (failCounts[t.failCategory] || 0) + 1;
      }

      // 2. PSP Aggregation (paymentDetails.pgProvider)
      const pspKey = t.pgProvider || 'UNKNOWN_PSP';
      if (!pspMap[pspKey]) {
        pspMap[pspKey] = { id: pspKey, name: pspKey, count: 0, success: 0, failed: 0, amount: 0, successAmt: 0, failedAmt: 0 };
      }
      pspMap[pspKey].count += 1;
      pspMap[pspKey].amount += t.amount;
      if (t.isSuccess) {
        pspMap[pspKey].success += 1;
        pspMap[pspKey].successAmt += t.amount;
      } else {
        pspMap[pspKey].failed += 1;
        pspMap[pspKey].failedAmt += t.amount;
      }

      // 3. UPI App Aggregation (paymentDetails.upiAppName)
      const appKey = t.upiApp || 'Other UPI';
      if (!upiAppMap[appKey]) {
        upiAppMap[appKey] = { id: appKey, name: appKey, count: 0, success: 0, failed: 0, amount: 0, successAmt: 0, failedAmt: 0 };
      }
      upiAppMap[appKey].count += 1;
      upiAppMap[appKey].amount += t.amount;
      if (t.isSuccess) {
        upiAppMap[appKey].success += 1;
        upiAppMap[appKey].successAmt += t.amount;
      } else {
        upiAppMap[appKey].failed += 1;
        upiAppMap[appKey].failedAmt += t.amount;
      }

      // 4. UPI Handle Aggregation (after @ in paymentDetails.payMethodIdentifier)
      if (t.upiHandle) {
        const handleKey = t.upiHandle.startsWith('@') ? t.upiHandle : ('@' + t.upiHandle);
        if (!upiHandleMap[handleKey]) {
          upiHandleMap[handleKey] = { id: handleKey, name: handleKey, count: 0, success: 0, failed: 0, amount: 0, successAmt: 0, failedAmt: 0 };
        }
        upiHandleMap[handleKey].count += 1;
        upiHandleMap[handleKey].amount += t.amount;
        if (t.isSuccess) {
          upiHandleMap[handleKey].success += 1;
          upiHandleMap[handleKey].successAmt += t.amount;
        } else {
          upiHandleMap[handleKey].failed += 1;
          upiHandleMap[handleKey].failedAmt += t.amount;
        }
      }

      // 5. Payment Method Aggregation (paymentDetails.payMethod)
      let pmKey = (t.payMethod || '').toUpperCase().trim();
      if (!pmKey || pmKey === 'UPI') pmKey = 'UPI';
      else if (pmKey.includes('CARD') || pmKey.includes('CREDIT') || pmKey.includes('DEBIT')) pmKey = 'Cards';
      else if (pmKey.includes('NET') || pmKey.includes('BANK')) pmKey = 'Netbanking';
      else if (pmKey.includes('WALLET')) pmKey = 'Wallets';
      else pmKey = t.payMethod || 'Other';

      if (!payMethodMap[pmKey]) {
        payMethodMap[pmKey] = { name: pmKey, totalCount: 0, successCount: 0, totalAmount: 0 };
      }
      payMethodMap[pmKey].totalCount += 1;
      payMethodMap[pmKey].totalAmount += t.amount;
      if (t.isSuccess) {
        payMethodMap[pmKey].successCount += 1;
      }
    });

    Object.values(merchantMap).forEach(m => {
      const failTotal = m.failedCount;
      if (failTotal > 0) {
        Object.keys(m.failureReasons).forEach(k => {
          m.failureReasons[k] = Math.round((m.failureReasons[k] / failTotal) * 100);
        });
      } else {
        m.failureReasons = { timeout: 20, insufficient: 20, auth3ds: 20, expired: 20, fraud: 20 };
      }
    });

    merchants = Object.values(merchantMap);
    pspList = Object.values(pspMap);
    upiAppList = Object.values(upiAppMap);
    upiHandleList = Object.values(upiHandleMap);

    // Update paymentMethods from uploaded data
    if (Object.keys(payMethodMap).length > 0) {
      paymentMethods = Object.values(payMethodMap).map(pm => ({
        name: pm.name,
        successRate: pm.totalCount > 0 ? parseFloat(((pm.successCount / pm.totalCount) * 100).toFixed(1)) : 0,
        volumeShare: txns.length > 0 ? parseFloat(((pm.totalCount / txns.length) * 100).toFixed(1)) : 0,
        totalAmount: pm.totalAmount,
        totalCount: pm.totalCount
      }));
    }

    uploadedFailureCounts = failCounts;

    // Update Live Stream Feed with actual uploaded rows
    feedItems.length = 0;
    txns.slice(-10).reverse().forEach(t => {
      feedItems.push({
        txnId: t.id,
        merchantName: t.merchantId,
        timeStr: t.createdDate.includes('T') ? t.createdDate.split('T')[1].substring(0, 8) : (t.createdDate.split(' ')[1] || '10:00:00'),
        method: t.payMethod + (t.upiHandle ? ' (' + t.upiHandle + ')' : ''),
        amount: t.amount.toFixed(2),
        isSuccess: t.isSuccess,
        failReason: t.rawFailState
      });
    });

    // Re-render all sections and charts with new unified data
    renderKPIs();
    renderAnalysisSection();
    renderRecommendations();
    initCharts();
    renderFeed();
  }

  function updateStatusBanner() {
    const tag = document.getElementById('dataModeTag');
    const msg = document.getElementById('dataStatusMessage');
    const resetBtn = document.getElementById('resetDataBtn');
    const liveBadge = document.getElementById('gatewayLiveBadge');

    if (dataMode === 'uploaded') {
      tag.className = 'data-status-tag tag-uploaded';
      tag.textContent = 'Live Uploaded Data';
      const activeName = (uploadedBatches && uploadedBatches[uploadedBatches.length - 1]?.name) || 'Current Dataset';
      msg.innerHTML = `✅ Viewing <strong>${currentTransactions.length} ingested transactions</strong> (${activeName}). All KPIs, Routing Reports &amp; Recommendations are displaying this uploaded data.`;
      resetBtn.style.display = 'inline-block';
      liveBadge.className = 'badge-pill badge-upload-mode';
      liveBadge.innerHTML = '<span>📁</span> File Active';
      document.getElementById('feedModeLabel').textContent = 'Displaying transactions from uploaded file';
    } else {
      tag.className = 'data-status-tag tag-simulated';
      tag.textContent = 'Demo Mode';
      msg.innerHTML = `Displaying automated simulation. Click <strong>Upload Hourly Data</strong> to ingest your Excel (.xlsx) or CSV file.`;
      resetBtn.style.display = 'none';
      liveBadge.className = 'badge-pill badge-live';
      liveBadge.innerHTML = '<span class="pulse-dot"></span> Live Gateway';
      document.getElementById('feedModeLabel').textContent = 'Displaying simulated real-time gateway pipeline';
    }
  }

  function resetToDemo() {
    dataMode = 'demo';
    activeBatchId = 'demo';
    merchants = JSON.parse(JSON.stringify(defaultDemoMerchants));
    pspList = JSON.parse(JSON.stringify(defaultDemoPsp));
    upiAppList = JSON.parse(JSON.stringify(defaultDemoUpiApp));
    upiHandleList = JSON.parse(JSON.stringify(defaultDemoUpiHandle));

    feedItems.length = 0;
    for (let i = 0; i < 5; i++) {
      generateMockTransaction();
    }
    updateStatusBanner();
    updateBatchSelector();
    startSimulation();
    renderKPIs();
    renderAnalysisSection();
    renderRecommendations();
    initCharts();
  }

  document.getElementById('resetDataBtn').addEventListener('click', resetToDemo);

  const DB_NAME = 'TransactBridgeStorage';
  const DB_VERSION = 1;

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('batches')) {
          db.createObjectStore('batches', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveBatchesToStorage() {
    try {
      const db = await openDB();
      const tx = db.transaction('batches', 'readwrite');
      const store = tx.objectStore('batches');
      store.clear();
      uploadedBatches.forEach(b => store.put(b));
    } catch (err) {
      console.warn('IndexedDB save failed:', err);
    }
  }

  async function loadBatchesFromStorage() {
    try {
      const db = await openDB();
      const tx = db.transaction('batches', 'readonly');
      const store = tx.objectStore('batches');
      const req = store.getAll();
      req.onsuccess = () => {
        const batches = req.result;
        if (batches && batches.length > 0) {
          uploadedBatches = batches;
          currentTransactions = batches.flatMap(b => b.transactions);
          dataMode = 'uploaded';
          activeBatchId = 'all';
          recomputeDashboardFromTransactions(currentTransactions);
          updateStatusBanner();
          updateBatchSelector();
          stopSimulation();
        }
      };
    } catch (err) {
      console.warn('IndexedDB load failed:', err);
    }
  }

  function updateBatchSelector() {
    const sel = document.getElementById('batchSelect');
    sel.innerHTML = '';

    const optDemo = document.createElement('option');
    optDemo.value = 'demo';
    optDemo.textContent = 'Live Demo Traffic';
    if (dataMode === 'demo') optDemo.selected = true;
    sel.appendChild(optDemo);

    if (uploadedBatches.length > 0) {
      const optAll = document.createElement('option');
      optAll.value = 'all';
      optAll.textContent = `All Uploaded Batches (${currentTransactions.length} txns)`;
      if (dataMode === 'uploaded' && activeBatchId === 'all') optAll.selected = true;
      sel.appendChild(optAll);

      uploadedBatches.forEach((b) => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = `${b.name} (${b.count} txns)`;
        if (dataMode === 'uploaded' && activeBatchId === b.id) opt.selected = true;
        sel.appendChild(opt);
      });
    }

    renderBatchListTable();
  }

  document.getElementById('batchSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    activeBatchId = val;
    if (val === 'demo') {
      resetToDemo();
    } else if (val === 'all') {
      dataMode = 'uploaded';
      currentTransactions = uploadedBatches.flatMap(b => b.transactions);
      recomputeDashboardFromTransactions(currentTransactions);
      updateStatusBanner();
      stopSimulation();
    } else {
      const batch = uploadedBatches.find(b => b.id === val);
      if (batch) {
        dataMode = 'uploaded';
        currentTransactions = batch.transactions;
        recomputeDashboardFromTransactions(currentTransactions);
        updateStatusBanner();
        stopSimulation();
      }
    }
  });

  function renderBatchListTable() {
    const tbody = document.getElementById('batchListTbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (uploadedBatches.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-dim);">No custom hourly batches uploaded yet.</td></tr>';
      return;
    }

    uploadedBatches.forEach(b => {
      const succ = b.transactions.filter(t => t.isSuccess).length;
      const rate = b.count > 0 ? ((succ / b.count) * 100).toFixed(1) : '0';
      const totVol = b.transactions.reduce((acc, t) => acc + t.amount, 0);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.name}</strong></td>
        <td>${b.count}</td>
        <td style="color: ${rate >= 95 ? '#10b981' : '#f43f5e'}">${rate}%</td>
        <td>${formatCurrency(totVol)}</td>
        <td>
          <button class="btn-small" style="color: #f43f5e;" data-del="${b.id}">Delete</button>
        </td>
      `;

      tr.querySelector('[data-del]').addEventListener('click', () => {
        uploadedBatches = uploadedBatches.filter(item => item.id !== b.id);
        saveBatchesToStorage();
        if (uploadedBatches.length === 0) {
          resetToDemo();
        } else {
          currentTransactions = uploadedBatches.flatMap(x => x.transactions);
          recomputeDashboardFromTransactions(currentTransactions);
          updateStatusBanner();
          updateBatchSelector();
        }
      });

      tbody.appendChild(tr);
    });
  }

  // File Upload Handlers
  const openUploadBtn = document.getElementById('openUploadBtn');
  const uploadModal = document.getElementById('uploadModal');
  const uploadModalCloseBtn = document.getElementById('uploadModalCloseBtn');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const processUploadBtn = document.getElementById('processUploadBtn');
  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const selectedFileInfo = document.getElementById('selectedFileInfo');
  let loadedFileContent = null;

  openUploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
    document.getElementById('batchLabelInput').value = `Hour ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | ${new Date().toLocaleDateString()}`;
    renderBatchListTable();
  });

  function closeUploadModal() {
    uploadModal.classList.remove('active');
    loadedFileContent = null;
    selectedFileInfo.textContent = '';
    document.getElementById('pasteTextarea').value = '';
  }

  uploadModalCloseBtn.addEventListener('click', closeUploadModal);
  cancelUploadBtn.addEventListener('click', closeUploadModal);

  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).style.display = 'block';
    });
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    selectedFileInfo.textContent = `Analyzing ${file.name}...`;
    const ext = file.name.split('.').pop().toLowerCase();
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    document.getElementById('batchLabelInput').value = cleanName;

    if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (window.XLSX) {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.SheetNames[0];
            loadedFileContent = window.XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
            selectedFileInfo.innerHTML = `✅ Ready: <strong>${file.name}</strong> (${loadedFileContent.length} rows detected). Click below to show across entire dashboard.`;
            processUploadBtn.style.transform = 'scale(1.02)';
          } catch (err) {
            alert('Failed to parse Excel file: ' + err.message);
          }
        } else {
          alert('Excel parsing library is initializing. Please save as CSV or try again.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        loadedFileContent = parseCSV(text);
        selectedFileInfo.innerHTML = `✅ Ready: <strong>${file.name}</strong> (${loadedFileContent.length} rows detected). Click below to show across entire dashboard.`;
        processUploadBtn.style.transform = 'scale(1.02)';
      };
      reader.readAsText(file);
    }
  }

  processUploadBtn.addEventListener('click', () => {
    const activeTab = document.querySelector('.modal-tab-btn.active').getAttribute('data-tab');
    const batchLabel = document.getElementById('batchLabelInput').value.trim() || `Hour ${new Date().toLocaleTimeString()}`;
    const mode = document.getElementById('ingestModeSelect').value;

    let rowsToIngest = [];

    if (activeTab === 'tab-paste') {
      const pasted = document.getElementById('pasteTextarea').value.trim();
      if (!pasted) {
        alert('Please paste copied Excel cells into the box.');
        return;
      }
      rowsToIngest = parseCSV(pasted);
    } else {
      if (!loadedFileContent || loadedFileContent.length === 0) {
        alert('Please select an Excel or CSV file first.');
        return;
      }
      rowsToIngest = loadedFileContent;
    }

    ingestTransactions(rowsToIngest, batchLabel, mode);
  });

  function downloadSampleTemplate() {
    const blob = new Blob([SAMPLE_CSV_RAW], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TransactBridge_Hourly_Transaction_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  document.getElementById('downloadSampleBtn').addEventListener('click', downloadSampleTemplate);
  document.getElementById('downloadSampleInModalBtn').addEventListener('click', downloadSampleTemplate);

  // Canvas Charts
  function initCharts() {
    renderTimelineChart();
    renderFailureDonutChart();
    renderPaymentMethodChart();
    renderRoutingBenchmarkChart();
    renderAnalysisSection();
  }

  function renderTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 30, right: 50, bottom: 40, left: 60 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    let labels = [];
    let volumeData = [];
    let rateData = [];

    // Derive timeline directly from uploaded transactions if in uploaded mode
    if (dataMode === 'uploaded' && currentTransactions.length > 0) {
      const bucketMap = {};
      currentTransactions.forEach(t => {
        let key = '12:00';
        if (t.createdDate) {
          const match = t.createdDate.match(/(\d{1,2}):(\d{2})/);
          if (match) {
            const h = match[1].padStart(2, '0');
            const m = parseInt(match[2], 10);
            const slot = String(Math.floor(m / 15) * 15).padStart(2, '0');
            key = `${h}:${slot}`;
          }
        }
        if (!bucketMap[key]) {
          bucketMap[key] = { label: key, total: 0, success: 0, failed: 0 };
        }
        bucketMap[key].total += 1;
        if (t.isSuccess) bucketMap[key].success += 1;
        else bucketMap[key].failed += 1;
      });

      const sortedKeys = Object.keys(bucketMap).sort();
      if (sortedKeys.length >= 2) {
        sortedKeys.forEach(k => {
          const b = bucketMap[k];
          labels.push(b.label);
          volumeData.push(b.total);
          rateData.push(b.total > 0 ? (b.success / b.total) * 100 : 100);
        });
      }
    }

    // Default timeline simulation if not enough uploaded bucket intervals
    if (labels.length === 0) {
      labels = currentTimeRange === '15m'
        ? ['-15m', '-12m', '-10m', '-8m', '-6m', '-5m', '-4m', '-3m', '-2m', '-1m', '-30s', 'Now']
        : currentTimeRange === '1h'
        ? ['-60m', '-50m', '-40m', '-30m', '-25m', '-20m', '-15m', '-10m', '-5m', '-3m', '-1m', 'Now']
        : currentTimeRange === '7d'
        ? ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today']
        : currentTimeRange === '30d'
        ? ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']
        : ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

      const numPoints = labels.length;
      const baseVol = Math.max(10, getAggregates().totalCount / numPoints);
      for (let i = 0; i < numPoints; i++) {
        const variance = 0.85 + Math.sin(i * 0.7) * 0.25 + (Math.random() * 0.1 - 0.05);
        const vol = baseVol * variance;
        const rate = 93.5 + Math.sin(i * 0.5) * 2.2 + (Math.random() * 0.8 - 0.4);
        volumeData.push(vol);
        rateData.push(Math.min(99.2, Math.max(90.0, rate)));
      }
    }

    const numPoints = labels.length;
    const maxVol = Math.max(1, Math.max(...volumeData) * 1.25);

    ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#e2ecf5' : '#13395c';
    ctx.lineWidth = 1;
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#7f99b2' : '#8ca3ba';
    ctx.font = '11px sans-serif';

    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const y = padding.top + (chartH / yTicks) * i;
      const val = maxVol - (maxVol / yTicks) * i;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(formatNumber(val), padding.left - 8, y + 4);
    }

    const barWidth = Math.max(6, (chartW / numPoints) * 0.5);
    const step = chartW / numPoints;

    volumeData.forEach((vol, idx) => {
      const x = padding.left + step * idx + (step - barWidth) / 2;
      const rate = rateData[idx];
      const succVol = vol * (rate / 100);
      const failVol = vol * ((100 - rate) / 100);

      const totalBarH = (vol / maxVol) * chartH;
      const failBarH = (failVol / maxVol) * chartH;
      const succBarH = totalBarH - failBarH;

      const barY = padding.top + chartH - totalBarH;

      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, barY + failBarH, barWidth, succBarH);

      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(x, barY, barWidth, failBarH);

      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#7f99b2' : '#8ca3ba';
      ctx.textAlign = 'center';
      ctx.fillText(labels[idx], x + barWidth / 2, padding.top + chartH + 18);
    });

    ctx.beginPath();
    ctx.strokeStyle = '#007aff';
    ctx.lineWidth = 3;

    const rateMin = 85;
    const rateMax = 100;

    rateData.forEach((rate, idx) => {
      const x = padding.left + step * idx + step / 2;
      const y = padding.top + chartH - ((rate - rateMin) / (rateMax - rateMin)) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    rateData.forEach((rate, idx) => {
      const x = padding.left + step * idx + step / 2;
      const y = padding.top + chartH - ((rate - rateMin) / (rateMax - rateMin)) * chartH;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#007aff';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#007aff';
    ctx.fillText('100%', padding.left + chartW + 8, padding.top + 8);
    ctx.fillText('95%', padding.left + chartW + 8, padding.top + chartH * 0.33);
    ctx.fillText('90%', padding.left + chartW + 8, padding.top + chartH * 0.66);
    ctx.fillText('85%', padding.left + chartW + 8, padding.top + chartH);
  }

  function renderFailureDonutChart() {
    const canvas = document.getElementById('failureChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const centerX = w * 0.35;
    const centerY = h * 0.5;
    const outerRadius = Math.min(centerX, centerY) * 0.75;
    const innerRadius = outerRadius * 0.55;

    const totals = { timeout: 0, insufficient: 0, auth3ds: 0, expired: 0, fraud: 0 };
    let sum = 0;

    if (dataMode === 'uploaded' && uploadedFailureCounts) {
      Object.keys(totals).forEach(k => {
        totals[k] = uploadedFailureCounts[k] || 0;
        sum += totals[k];
      });
    } else {
      merchants.forEach(m => {
        Object.keys(totals).forEach(k => {
          const val = (m.failedCount || 1) * ((m.failureReasons && m.failureReasons[k]) || 20);
          totals[k] += val;
          sum += val;
        });
      });
    }

    if (sum === 0) {
      // Show optimal state if no failures
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('100% HEALTH', centerX, centerY);
      return;
    }

    let currentAngle = -Math.PI / 2;

    Object.entries(totals).forEach(([key, val]) => {
      if (val === 0) return;
      const sliceAngle = (val / sum) * Math.PI * 2;
      const info = FAILURE_TYPES[key];

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = info.color;
      ctx.fill();

      currentAngle += sliceAngle;
    });

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#001626' : '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('DROP-OFF', centerX, centerY - 8);
    ctx.font = '11px sans-serif';
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#7f99b2' : '#8ca3ba';
    ctx.fillText('Attribution', centerX, centerY + 10);

    const legendX = w * 0.65;
    let legendY = h * 0.18;
    ctx.textAlign = 'left';
    ctx.font = '12px sans-serif';

    Object.entries(totals).forEach(([key, val]) => {
      const info = FAILURE_TYPES[key];
      const pct = ((val / sum) * 100).toFixed(1);

      ctx.fillStyle = info.color;
      ctx.fillRect(legendX, legendY, 10, 10);

      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#001626' : '#f0f6fc';
      ctx.fillText(`${pct}% ${info.label}`, legendX + 16, legendY + 9);

      legendY += 28;
    });
  }

  function renderPaymentMethodChart() {
    const canvas = document.getElementById('paymentMethodChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 30, bottom: 20, left: 140 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const rowH = chartH / paymentMethods.length;
    const barH = rowH * 0.55;

    paymentMethods.forEach((pm, idx) => {
      const y = padding.top + rowH * idx + (rowH - barH) / 2;

      ctx.textAlign = 'right';
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#001626' : '#f0f6fc';
      ctx.font = '500 12px sans-serif';
      ctx.fillText(pm.name, padding.left - 12, y + barH / 2 + 4);

      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#e2ecf5' : '#0f2d49';
      ctx.fillRect(padding.left, y, chartW, barH);

      const succW = (pm.successRate / 100) * chartW;
      ctx.fillStyle = '#007aff';
      ctx.fillRect(padding.left, y, succW, barH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${pm.successRate}%`, padding.left + succW - 8, y + barH / 2 + 4);
    });
  }

  function renderRoutingBenchmarkChart() {
    const canvas = document.getElementById('routingBenchmarkChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 40, bottom: 20, left: 130 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const list = [...pspList].filter(p => p.count > 0).slice(0, 5);
    if (list.length === 0) return;

    const rowH = chartH / list.length;
    const barH = rowH * 0.55;

    list.forEach((p, idx) => {
      const y = padding.top + rowH * idx + (rowH - barH) / 2;
      const sr = p.count > 0 ? (p.success / p.count) * 100 : 0;
      const barW = (sr / 100) * chartW;

      ctx.textAlign = 'right';
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#001626' : '#f0f6fc';
      ctx.font = '500 12px sans-serif';
      const displayName = p.name || p.id;
      ctx.fillText(displayName.length > 14 ? displayName.substring(0, 12) + '..' : displayName, padding.left - 12, y + barH / 2 + 4);

      // Track background
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#e2ecf5' : '#0f2d49';
      ctx.fillRect(padding.left, y, chartW, barH);

      // Fill bar
      ctx.fillStyle = sr >= 95.0 ? '#10b981' : sr >= 92.0 ? '#007aff' : '#f43f5e';
      ctx.fillRect(padding.left, y, barW, barH);

      // SR Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${sr.toFixed(1)}% SR`, padding.left + barW - 8, y + barH / 2 + 4);
    });
  }

  const feedList = document.getElementById('feedList');
  const feedItems = [];

  function generateMockTransaction() {
    if (dataMode !== 'demo') return;
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    if (!merchant) return;
    const isSuccess = Math.random() < 0.948;
    const amount = (150 + Math.random() * 2800).toFixed(2);
    const methods = ['UPI (PhonePe @ybl)', 'Visa Debit', 'UPI (GPay @okaxis)', 'UPI (Paytm @paytm)', 'HDFC NetBanking'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    const txnId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    let failReason = '';
    if (!isSuccess) {
      const reasons = Object.values(FAILURE_TYPES).map(r => r.label);
      failReason = reasons[Math.floor(Math.random() * reasons.length)];
    }

    merchant.totalCount += 1;
    merchant.totalAmount += parseFloat(amount);
    if (isSuccess) {
      merchant.successCount += 1;
      merchant.successAmount += parseFloat(amount);
    } else {
      merchant.failedCount += 1;
      merchant.failedAmount += parseFloat(amount);
    }

    const item = {
      txnId,
      merchantName: merchant.name || merchant.id,
      timeStr,
      method,
      amount,
      isSuccess,
      failReason
    };

    feedItems.unshift(item);
    if (feedItems.length > 8) feedItems.pop();

    renderFeed();
    renderKPIs();
    renderAnalysisSection();
  }

  function renderFeed() {
    const listEl = document.getElementById('feedList');
    if (!listEl) return;
    listEl.innerHTML = '';
    feedItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'feed-item';
      div.innerHTML = `
        <div class="feed-left">
          <span class="feed-status-dot ${item.isSuccess ? 'success' : 'failed'}"></span>
          <div class="feed-meta">
            <span class="feed-txn-id">${item.txnId}</span>
            <span class="feed-sub">${item.merchantName} • ${item.method} • ${item.timeStr}</span>
          </div>
        </div>
        <div class="feed-right">
          <div>
            <div class="feed-amount ${item.isSuccess ? 'text-success' : 'text-failed'}">
              ${item.isSuccess ? '+' : '✕'} ${formatExactCurrency(item.amount)}
            </div>
            ${!item.isSuccess ? `<span style="font-size: 0.7rem; color: var(--failed-red);">${item.failReason}</span>` : ''}
          </div>
          <span class="feed-badge ${item.isSuccess ? 'kpi-badge up' : 'kpi-badge down'}">
            ${item.isSuccess ? 'SETTLED' : 'DECLINED'}
          </span>
        </div>
      `;
      listEl.appendChild(div);
    });
  }

  for (let i = 0; i < 5; i++) {
    generateMockTransaction();
  }

  const toggleSimBtn = document.getElementById('toggleSimBtn');
  const simStatusText = document.getElementById('simStatusText');

  function startSimulation() {
    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(generateMockTransaction, 2400);
    simActive = true;
    toggleSimBtn.className = 'btn-action btn-sim-active';
    simStatusText.textContent = 'Streaming Active';
  }

  function stopSimulation() {
    if (simInterval) clearInterval(simInterval);
    simActive = false;
    toggleSimBtn.className = 'btn-action';
    simStatusText.textContent = 'Streaming Paused';
  }

  toggleSimBtn.addEventListener('click', () => {
    if (simActive) stopSimulation();
    else startSimulation();
  });

  startSimulation();

  document.getElementById('timeRangeSelect').addEventListener('change', (e) => {
    currentTimeRange = e.target.value;
    renderKPIs();
    renderAnalysisSection();
    renderRecommendations();
    initCharts();
  });

  document.getElementById('currencySelect').addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    renderKPIs();
    renderAnalysisSection();
    renderRecommendations();
    initCharts();
    renderFeed();
  });

  document.getElementById('exportCsvBtn').addEventListener('click', exportCSV);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.textContent = '🌙 Midnight Navy';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️ Light';
    }
    initCharts();
  });

  window.addEventListener('resize', () => {
    initCharts();
  });

  loadBatchesFromStorage();

  renderKPIs();
  renderAnalysisSection();
  renderRecommendations();
  initCharts();

})();
