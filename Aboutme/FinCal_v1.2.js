// FinCal 
// version 1.2
function PMT(rate,nPay,loanAmount) {
	// calculate loan constant payment with a fixed interest rate over a specific time period
	// Inputs:
	//	1. rate: interest rate over a period between payments
	//	2. nPay: number of payments
	//	3. loanAmount: present value of the loans
	var cPay = loanAmount*rate/(1-Math.pow(1+rate,-nPay));
	return cPay;
}
function NPV(cfArray,r) {
	// find NPV for a cash flow array and interest rate r
	var ncf = cfArray.length;
	var NPVal = 0.0;
	for (n=0;n<ncf; n++) {
		NPVal+=cfArray[n]/Math.pow(1+r,n);
	}
	return NPVal;
}
function IRR(cfArray,guest){
	// Inputs: 
	//	1. cfArray is a cashflow array
	// 2. guest for IRR
	// If cfArray[0] > 0 , NPV is increasing function of interest rate; else, NPV is decreasing function of interest rate
	// we consider NPL is increasing function of r only
	// Set tolerance for NPV
	npvTol = 0.000001;
	//
	if (guest<=0) {alert('The interest rate should be positive!');}
	//
	if (NPV(cfArray,guest*1.1)-NPV(cfArray,guest)<0) {cfArray = cfArray*(-1.0);}// if decreasing, make it increasing
	//
	var ra = guest*1.0;
	var rb = guest*1.0;
	// find rate at positive NPV
	do {
		rb *=1.1;
		NPV_rb = NPV(cfArray,rb);
	}
	while (NPV_rb<0);
	// find rate at negative NPV
	do {
		ra *=0.9;
		NPV_ra = NPV(cfArray,ra);
	}
	while (NPV_ra>0);
	//
	do {
		// IRR Candidate
		IRRC = ra - NPV_ra*(rb-ra)/(NPV_rb-NPV_ra); // interpolation
		NPV_IRRC = NPV(cfArray,IRRC);
		if (Math.abs(NPV_IRRC)<npvTol) {return IRRC;}
		else {
			if (NPV_IRRC<0) {ra = IRRC; NPV_ra = NPV(cfArray,ra);} 
			else { rb = IRRC; NPV_rb = NPV(cfArray,rb);}
		}
	}
	while (Math.abs(NPV_IRRC)>npvTol);
}
//
function numToStr(num,fo,nplace){
    // Covert numeric to string
	if (nplace===undefined) {nplace=0;}
	if (num==null){return null;}
	if (fo=='decimal') {
		return ''+num.toFixed(nplace).replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
	} else {
		return (num*100).toFixed(2)+'%';
	}
}//
// *************** BOND ***************
class Bond {
	constructor(BondInfoList,holiArr) {
		// write bond information
		this.BondName = BondInfoList[0];// "LOLC Plain";
		this.Status = BondInfoList[1];//"Listed";
		this.Issuer = BondInfoList[2];//"LOLC";
		this.BondType = BondInfoList[3];//"Senior Unsecured Plain Bond";
		this.IssueRating = BondInfoList[4];//"";
		this.SecuredBy = BondInfoList[5];//"";
		this.CompanyRating = BondInfoList[6];//"";
		this.GuaranteedBy = BondInfoList[7];//"";
		this.FaceValue = BondInfoList[8];// 100000; // in KHR
		this.InitialPrice = BondInfoList[9];// 100000; // in KHR
		this.IssueSize = BondInfoList[10];// 80; // in KHR'bn
		this.OutstandingSize = BondInfoList[11];// 80; // in KHR'bn
		this.CouponRate = BondInfoList[12];// 0.09;
		this.IssueTerm = BondInfoList[13];// 3; // in year
		this.IssueDate = BondInfoList[14];// new Date(2019, 2, 18);
		this.MaturityDate = BondInfoList[15];// new Date(2022, 2, 18);
		this.FirstTradingDate = BondInfoList[16];// new Date(2019, 3, 4);
		this.PaymentFrequency = BondInfoList[17];// 2; means twice per year
		this.DayCount = BondInfoList[18];// "Actual/365";
		this.RecordDate = BondInfoList[19];// 2; // number of business days before payment date
		this.Underwriter = BondInfoList[20];// "Yuanta Securities (Cambodia) Plc.";
		this.BondholdersRespresentative = BondInfoList[21];//"Acleda Securities";
		this.RegistrarTransferPayingAgent = BondInfoList[22];// "Acleda Bank";
		this.TradingMethod = BondInfoList[23];// "ATM & NTM";
		this.InitialExRate = BondInfoList[24];// "Acleda Bank Bid Rate";
		this.ReferenceExRate = BondInfoList[25];//"Acleda Bank Ask Rate";
		this.WHT = BondInfoList[26];// Witholding Tax
		this.Denomination = BondInfoList[27];// KHR
		this.IsFXlinked = BondInfoList[28];
		this.RecordDateType = BondInfoList[29];// business or calendar
		//
		this.Holidays = holiArr;
		// generate additional information
		var CoupA = genCouponDateArray(this.IssueDate,this.IssueTerm,this.PaymentFrequency);
		this.CouponDateArray = CoupA[0];
		this.DaysEachCperiod = CoupA[1]; 
		this.RecordDateArray = recordDateArray(this.CouponDateArray,holiArr,this.RecordDate,this.RecordDateType);
		this.ExCoupDateArray = genExCouponDatesArray(this.CouponDateArray,this.RecordDateArray,holiArr);
		this.WithinExPeriodDateArray = genWithinExPeriodDatesArray(this.CouponDateArray,this.RecordDateArray,holiArr);
		this.CouponArray = couponArray(this.FaceValue,this.CouponRate,this.DaysEachCperiod,this.DayCount,this.PaymentFrequency); 
		this.nCoupon = this.CouponArray.length;
		// this.WHTtext
		this.WHTtext = numToStr(this.WHT) + " for non-residents";
		// this.PaymentFrequencyText
		switch(this.PaymentFrequency) {
			case 1: 
				this.PaymentFrequencyText = "Annually";
				break;
			case 2:
				this.PaymentFrequencyText = "Semi-Annually";
				break;
			case 4:
				this.PaymentFrequencyText = "Quarterly";
				break;
			case 12:
				this.PaymentFrequencyText = "Monthly";
			default:
				this.PaymentFrequencyText = "NaN";
		}
		this.RecordDateText = this.RecordDate+ " "+this.RecordDateType+" days before payment date"
	}
	getPrevNextPaymentDate(settlementDate) {
		// get previous & next payment date for a settlement day
		// Will save the following parameters
		//	this.TimeToMaturity, this.PrevPayDate, this.NextPayDate, this.NextCouponID,
		//	this.DaysToRemainingCouponArray, this.RemainingCouponArray
		//
		this.DaysToMaturity =DaysDiff(settlementDate,this.MaturityDate); 
		this.TimeToMaturity=this.DaysToMaturity/365; // in years
		//
		var prevPayDate, nextPayDate; 
		var tradingDate = workDay(settlementDate,-2,this.Holidays);
		var i = 0;
		while (tradingDate.getTime()>=this.ExCoupDateArray[i].getTime()) {
			i += 1;
			if (i==this.nCoupon) {break;}
		}
		if (i>0) {
			prevPayDate = this.CouponDateArray[i-1];
		} else {prevPayDate = "";}
		if (i==this.nCoupon) {
			nextPayDate = "";
		} else {nextPayDate = this.CouponDateArray[i];}
		this.PrevPayDate = prevPayDate;
		this.NextPayDate = nextPayDate;
		this.NextCouponID = i;// next coupon ID 
		var d2NC =[];
		var remCoupon = [];
		for (var j=i;j<this.nCoupon;j++) {
			d2NC.push(DaysDiff(settlementDate,this.CouponDateArray[j]));// days to next coupon
			remCoupon.push(this.CouponArray[j]);
		}
		this.DaysToRemainingCouponArray = d2NC; // days to next and following coupon
		this.RemainingCouponArray = remCoupon;// remaining coupons
	}
	grossPrice(YTM) {
		// Calculate gross price for a YTM
		var pf = this.PaymentFrequency;
		// gross price
		var gPrice = 0; // Gross Price
		for (var i=0;i<this.RemainingCouponArray.length;i++) {
			var d2NC = this.DaysToRemainingCouponArray[i];// days to next coupon
			gPrice += this.RemainingCouponArray[i]*Math.pow((1+YTM/pf),-pf*d2NC/365);
		}
		gPrice += this.FaceValue*Math.pow((1+YTM/pf),-pf*d2NC/365);
		return gPrice;
	}
	grossCleanPrice(settlementDate,YTM) {
		// calculate gross price, clean price, accrued int. at a settlement date and YTM
		if (settlementDate=="") {return "";}
		this.getPrevNextPaymentDate(settlementDate);
		var gPrice = this.grossPrice(YTM);
		// Accrued interest
		var tradingDate = workDay(settlementDate,-2,this.Holidays);
		var isInExPer = IsWithinExPeriod(tradingDate,this.WithinExPeriodDateArray);
		var dsc_ = DSC(settlementDate,this.CouponDateArray);
		var dcs_ = DCS(settlementDate,this.IssueDate,this.CouponDateArray);
		var accInt = accrueInt(this.FaceValue,this.CouponRate,dsc_,dcs_,isInExPer,this.DayCount,this.PaymentFrequency);
		// Clean price
		var cPrice = gPrice - accInt;
		return [gPrice,cPrice,accInt,dsc_,dcs_];
	}
	searchYTM(settDate,gPrice) {
		// Search YTM for a given gPrice
		this.getPrevNextPaymentDate(settDate);
		//
		if (gPrice - this.grossPrice(0.0)>0) {
			alert("Negative YTM! Input price should not be bigger than "
					+ numToStr(this.grossPrice(0.0),"decimal"));
			return;
		}
		// Objective: Obj = gPrice - this.grossPrice(YTM)
		// Set tolerance and guest
		var npvTol = 0.000001;
		var guest = this.CouponRate;
		var ObjF_ra, ObjF_rb, ObjF_rc;
		//
		var ra = guest*1.0;
		var rb = guest*1.0;
		var rc;
		// find rate at positive ObjF
		do {
			rb *=1.1;
			ObjF_rb = gPrice - this.grossPrice(rb);//
		}
		while (ObjF_rb<0);
		// find rate at negative ObjF
		do {
			ra *=0.9;
			ObjF_ra = gPrice - this.grossPrice(ra);
		}
		while (ObjF_ra>0);
		//
		do {
			// YTM Candidate
			rc = ra - ObjF_ra*(rb - ra)/(ObjF_rb - ObjF_ra); // interpolation
			ObjF_rc = gPrice - this.grossPrice(rc);
			if (Math.abs(ObjF_rc)<npvTol) {return rc;}
			else {
				if (ObjF_rc<0) {var ra = rc; ObjF_ra = gPrice - this.grossPrice(ra);} 
				else {var rb = rc; ObjF_rb = gPrice - this.grossPrice(rb);}
			}
		}
		while (Math.abs(ObjF_rc)>npvTol);
	}
}

// *******************************************************************
// DEALING WITH DATE IN JS
// *******************************************************************
//.........................................
function YYYYMMDD(d1) {
	var mm = d1.getMonth() + 1; // getMonth() is zero-based
	var dd = d1.getDate();
  
	return [d1.getFullYear()+'-',
			(mm>9 ? '' : '0') + mm+'-',
			(dd>9 ? '' : '0') + dd
		   ].join('');
  };
//....................
function dStrToDate(dateStr) {
	// dateStr of form mm/dd/yyyy
	m = Number(dateStr.substr(0,2))-1;
	dd = Number(dateStr.substr(3,2));
	yyyy = Number(dateStr.slice(6));
	return new Date(yyyy,m,dd);
}
//.............................
function DaysDiff(d1,d2) {
	// Find number of days difference between two dates
    // input d1: date 1
    //		 d2: date 2
 	return (d2-d1)/(1000*3600*24);
}
function dateArray(d1,d2){
    // Create date array between two dates
    var dateArr = [d1]; // create a date array
    var n = DaysDiff(d1,d2);// number of days between the two dates
    var sY = d1.getFullYear();// start year
    var sM = d1.getMonth();// start month
    var sD = d1.getDate();//start day
    // check if n<1
    if (n<1) {
        return dateArr;
    } else {
        var i;
        for (i=1; i<=n; i++) {
            var di = new Date(sY,sM,sD+i);
            dateArr.push(di);
        }
        return dateArr;
    }
}
function dateToStr(d1){
    // from date to date string
	// Input d1 is a date type
	if (isNaN(d1)) {return NaN;}
	if (d1=="") {return "";}
    var datestr = d1.toDateString();
    return datestr.slice(4,10)+", "+datestr.slice(10);
}
function checkWeekendHoliday(d1,holidaysArr){
    // Return true if a date d1 is weekend or holiday
	// Input: d1: a date,holidaysArr: an array of holidays 
    if (d1.getDay()==0 || d1.getDay()==6) {
        return true;
    } else if (holidaysArr.find(compareTwoDates)) {
        return true;
    } else {
        return false;
	}
	// nested function for compare two dates
	function compareTwoDates(di) {return di.getTime()==d1.getTime();}
}
function genHolidaysArray() {
	var holiArr = [
			new Date(2018, 10, 21),
			new Date(2018, 10, 22),
			new Date(2018, 10, 23),
			new Date(2018, 11, 10),
			new Date(2019, 0, 1),
			new Date(2019, 0, 7),
			new Date(2019, 1, 19),
			new Date(2019, 2, 8),
			new Date(2019, 3, 15),
			new Date(2019, 3, 16),
			new Date(2019, 3, 17),
			new Date(2019, 4, 1),
			new Date(2019, 4, 13),
			new Date(2019, 4, 14),
			new Date(2019, 4, 15),
			new Date(2019, 4, 20),
			new Date(2019, 4, 22),
			new Date(2019, 5, 18),
			new Date(2019, 8, 24),
			new Date(2019, 8, 27),
			new Date(2019, 8, 30),
			new Date(2019, 9, 15),
			new Date(2019, 9, 23),
			new Date(2019, 9, 29),
			new Date(2019, 10, 11),
			new Date(2019, 10, 12),
			new Date(2019, 10, 13),
			new Date(2019, 11, 10),
			new Date(2020, 0, 1),
			new Date(2020, 0, 7),
			new Date(2020, 4, 1),
			new Date(2020, 4, 6),
			new Date(2020, 4, 11),
			new Date(2020, 4, 14),
			new Date(2020, 5, 18),
			new Date(2020, 8, 16),
			new Date(2020, 8, 17),
			new Date(2020, 8, 18),
			new Date(2020, 8, 24),
			new Date(2020, 9, 15),
			new Date(2020, 9, 29),
			new Date(2020, 9, 30),
			new Date(2020, 9, 31),
			new Date(2020, 10, 2),
			new Date(2020, 10, 9),
			new Date(2021, 0, 1),
			new Date(2021, 0, 7),
			new Date(2021, 3, 14),
			new Date(2021, 3, 15),
			new Date(2021, 3, 16),
			new Date(2021, 3, 26),
			new Date(2021, 3, 30),
			new Date(2021, 4, 1),
			new Date(2021, 4, 14),
			new Date(2021, 5, 18),
			new Date(2021, 8, 24),
			new Date(2021, 9, 5),
			new Date(2021, 9, 6),
			new Date(2021, 9, 7),
			new Date(2021, 9, 15),
			new Date(2021, 9, 29),
			new Date(2021, 10, 9),
			new Date(2021, 10, 18),
			new Date(2021, 10, 19),
			new Date(2021, 10, 20),
			new Date(2022, 0, 1),
			new Date(2022, 0, 7),
			new Date(2022, 1, 16),
			new Date(2022, 3, 14),
			new Date(2022, 3, 15),
			new Date(2022, 3, 16),
			new Date(2022, 4, 2),
			new Date(2022, 4, 14),
			new Date(2022, 4, 16),
			new Date(2022, 4, 19),
			new Date(2022, 5, 18),
			new Date(2022, 8, 24),
			new Date(2022, 8, 25),
			new Date(2022, 8, 26),
			new Date(2022, 8, 27),
			new Date(2022, 9, 15),
			new Date(2022, 9, 29),
			new Date(2022, 10, 7),
			new Date(2022, 10, 8),
			new Date(2022, 10, 9),
			new Date(2023, 0, 2),
			new Date(2023, 2, 8),
			new Date(2023, 3, 14),
			new Date(2023, 3, 15),
			new Date(2023, 3, 16),
			new Date(2023, 3, 17),
			new Date(2023, 4, 1),
			new Date(2023, 4, 4),
			new Date(2023, 4, 8),
			new Date(2023, 4, 15),
			new Date(2023, 5, 19)
		];
	return holiArr;
}
function workDay(startDate,ndays,holidaysArr){
	// find workday
	// Inputs: startDate: the start date
	//		   ndays: integer number of days 
	//		   holidaysArr: an array of holidays
	var y = startDate.getFullYear();
	var m = startDate.getMonth();
	var d = startDate.getDate();
	var wdaycount = 0; // number of workdays counted 
	var maxwday = Math.abs(ndays); // number of workdays allowed
	while (wdaycount<maxwday){
		d += ndays/Math.abs(ndays);
		if (checkWeekendHoliday(new Date(y,m,d),holidaysArr)==false) {
			wdaycount += 1;
		}
	}
	return new Date(y,m,d);
}
function settlementDate(d1,holidaysArr){
	// find settlement date corresponding to execution date d1
	// input: d1 is the execution date
	// 		return the next two business day if d1 is a workday, N/A otherwise
	if (checkWeekendHoliday(d1,holidaysArr)) {
		return "";
	} else {
		return workDay(d1,2,holidaysArr)
	}
}
function recordDateArray(cDateArr,holidaysArr,DbeforeCoup,recDtype){
	// find record date array corresponding to coupon date array
	// input: cDateArr is the coupon date array
	//		  holidaysArr is the holiday array
	//		  DbeforeCoup is the number of days before coupon date
	//		  recDtype is either "business" or "calendar"
	// 		return the second business day prior to each coupon date
	function recDate(d1) {
		if (recDtype=="business") {
			return workDay(d1,-DbeforeCoup,holidaysArr);
		} else {
			var rDc = new Date(d1.getFullYear(),d1.getMonth(),d1.getDate()-DbeforeCoup);
			while (checkWeekendHoliday(rDc,holidaysArr)) {
				rDc = new Date(rDc.getFullYear(),rDc.getMonth(),rDc.getDate()+1);
			}
			return rDc;
		}
	}
	return cDateArr.map(recDate);
}
function genCouponDateArray(IssueD,MatInYear,Freq) {
	// generate coupon date for bond with
	// 	IssueD: Issue Date  
	//	MatInYear: Maturity in Years
	// 	Freq: Frequency of coupon payment
	//		1: annually
	//		2: semi-annually
	//		4: quarterly
	//		else: annually
	var y = IssueD.getFullYear();
	var m = IssueD.getMonth();
	var d = IssueD.getDate();
	if (Freq!=1 && Freq!=2 && Freq!=4 && Freq!=12) {
		alert("Frequency must be 1, 2, 4, or 12!");
		return;
	} 
	var mi = 12/Freq; // num of months for increment
	var nCoupon = MatInYear*Freq; // number of coupon payments
	var cDateArr = [new Date(y,m+mi,d)]; // coupon date array
	var daysEachCperiodArr =[DaysDiff(IssueD,cDateArr[0])]; // array of days within each coupon period
	for (var i=2;i<nCoupon+1;i++) {
		cDateArr.push(new Date(y,m+i*mi,d));
		daysEachCperiodArr.push(DaysDiff(cDateArr[i-2],cDateArr[i-1]));
	}
	return [cDateArr,daysEachCperiodArr];
} 
function couponArray(FV,cRate,daysEachCperiodArr,dayCountConven,Freq) {
    // Inputs:
    //  FV: Face Value; cRate: Coupon Rate, daysEachCperiodArr: days within each coupon period array;
    //  dayCountConven: Day count convention; Freq: Frequency of payment during a year
	var nCoupon = daysEachCperiodArr.length;
    var coupA = [];
    switch (dayCountConven) {
        case "Actual/365Fixed":
            for (var i=0;i<nCoupon;i++) {
                coupA.push(FV*cRate*daysEachCperiodArr[i]/365);
            }
            break;
            default:// Actual/Actual(ICMA)
                for (var i=0;i<nCoupon;i++) {
                    coupA.push(FV*cRate/Freq);
                }
                break;
    }
	return coupA;
}

function genExCouponDatesArray(cDateArr,rDateArr,holidaysArr) {
	// Generate ex-coupon dates array
	// An ex-coupon date is the first day the bond starts trading without coupon
	// Inputs
	//		cDateArr: coupon date array
	//		rDateArr: record date array
	//		holidaysArr: holidays array
	var nc = cDateArr.length; // num of coupon payments
	var exCoupDateArr = [];
	var i=0;
	for (i=0;i<nc;i++) {
		rplushOne =workDay(rDateArr[i],1,holidaysArr); 
		if (rplushOne.getTime()<=cDateArr[i].getTime()) {
			exCoupDateArr.push(workDay(rplushOne,-2,holidaysArr));
		}		
	}
	return exCoupDateArr;
}
function genWithinExPeriodDatesArray(cDateArr,rDateArr,holidaysArr) {
	// Generate an array of dates within all ex-coupon periods
	// Inputs
	//		cDateArr: coupon date array
	//		rDateArr: record date array
	//		holidaysArr: holidays array
	var nc = cDateArr.length; // num of coupon payments
	var WithinExPeriodDateArr = [];
	var i=0;
	for (i=0;i<nc;i++) {
		var dFromRecToCoup = DaysDiff(rDateArr[i],cDateArr[i]); // num. of days from record date to coupon date
		for (var j=1;j<dFromRecToCoup+1;j++) {
			rplushj =workDay(rDateArr[i],j,holidaysArr);
			if (rplushj.getTime()<=cDateArr[i].getTime()) {
				WithinExPeriodDateArr.push(workDay(rplushj,-2,holidaysArr));
			}
		}	
	}
	return WithinExPeriodDateArr;
}
function IsWithinExPeriod(d1,WithinExPeriodDateArr) {
	// check if an execution date d1 is within an ex-coupon period
	// Inputs: 
	// 			d1: an execution date
	//			WithinExPeriodDateArr: an array of dates within ex-coupon period
	if (WithinExPeriodDateArr.find(compareTwoDates)) {
		return true;	
	} else {
		return false;
	}
	function compareTwoDates(di) {return di.getTime()==d1.getTime();}
}
function PrevNextPayDates(tradingDate,exCoupDateArr,cDateArr) {
	// get previous & next payment date for a settlement day
	var prevPayDate, nextPayDate;
	var i = 0;
	while (tradingDate.getTime()>=exCoupDateArr[i].getTime()) {
		i += 1;
	}
	if (i>0) {
		prevPayDate = cDateArr[i-1];
	} else {prevPayDate = "";}
	nextPayDate = cDateArr[i];
	return [prevPayDate,nextPayDate,i];
}
function DSC(settleDate,cDateArr) {
	// Find number of days between settlement date and next coupon date
	if (settleDate=="") {return;}
	var nc = cDateArr.length;//number of coupon payments
	var i=0;
	if (settleDate.getTime()>cDateArr[nc-1].getTime()) {
		//alert("Input settlement date exeeds maturity date!")
		return;
	}
	while (settleDate.getTime() > cDateArr[i].getTime()){
		i += 1;
	}
	return DaysDiff(settleDate,cDateArr[i]);
}
function DCS(settleDate,IssDate,cDateArr) {
	// Find number of days from last coupon date to settlement date
	if (settleDate=="") {return;}
	var IcDateArr = cDateArr.slice(0);// shallow copy
	IcDateArr.unshift(IssDate);
	var nc = IcDateArr.length;//number of coupon payments+1
	if (settleDate.getTime()>IcDateArr[nc-1].getTime() || settleDate.getTime()<=IcDateArr[0].getTime()) {
		//alert("Input settlement date must be within the bond life!")
		return;
	}
	var i = nc-1;
	while (settleDate.getTime() <= IcDateArr[i].getTime()){
		i -= 1;
	}
	return DaysDiff(IcDateArr[i], settleDate);
}
function accrueInt(FV, coupRate,dsc_,dcs_,isExCoup_,dayCountConven,Freq) {
    // Find accrued interest
    switch (dayCountConven) {
        case "Actual/365Fixed":
            return coupRate*FV*(isExCoup_*(-dsc_)+(1-isExCoup_)*dcs_)/365;
        default: // Actual/Actual(ICMA)
            return coupRate*FV*(isExCoup_*(-dsc_)+(1-isExCoup_)*dcs_)/(Freq*(dsc_+dcs_));
    }
}
function accrueIntArray(FV,coupRate,dscArr,dcsArr,isExCoupArr,wht,dayCountConven,Freq) {
	// find accrued interest array
	var aIntA = [];
	var whtA = [];// witholding tax
	var nr = dscArr.length;
    var i;
    switch (dayCountConven) {
        case "Actual/365Fixed":
            for (i=0;i<nr;i++) {
                aIntA.push(coupRate*FV*(isExCoupArr[i]*(-dscArr[i])+(1-isExCoupArr[i])*dcsArr[i])/365);
                whtA.push(coupRate*FV*dcsArr[i]*wht/365);
            }
            break;
        default:
            for (i=0;i<nr;i++) {
                aIntA.push(coupRate*FV*(isExCoupArr[i]*(-dscArr[i])+(1-isExCoupArr[i])*dcsArr[i])/(Freq*(dscArr[i]+dcsArr[i])));
                whtA.push(coupRate*FV*dcsArr[i]*wht/(Freq*(dscArr[i]+dcsArr[i])));
            }
            break;         
    }
	return [aIntA,whtA];
}
/// *******************************************************************
// *******************************************************************
// make google data table from javascript arrays
function makeDTforChart() {
	// make google data table from javascript arrays
	// Inputs: makeDTforChart(x1name,x1,x2name,x2,...)
	//	-	x1name: first variable's name
	//	-	x1: first variable
	var colHead = [];
	if (arguments.length % 2 !=0) {
		alert("Inputs to makeDTforChart not correct")
	} else {
		for (var i=0; i<arguments.length; i+=2) {
			var namei=arguments[i];
			colHead.push(namei);
		}
		var DTforChart=[colHead];
	
		for (var j=0; j<arguments[1].length; j++) {
			var rowj = [];
			for (var a=1; a<arguments.length; a+=2) {
				var xa = arguments[a];
				rowj.push(xa[j]);
			}
			DTforChart[j+1] = rowj;
		}
		var DT = new google.visualization.arrayToDataTable(DTforChart);
		return DT;
	}
}
//
function setDTrowsColor(DTab,rowIDs,BgColor){
	// Set background color in multi rows of a datatable
	var ncol= DTab.getNumberOfColumns();
	var bgstyle = 'background-color:'+BgColor;
	var idx,c;
	for (idx in rowIDs) {
		for (c=0;c<ncol;c++) {
			DTab.setProperty(rowIDs[idx],c,'style',bgstyle);
		}
	}
}
function setDTcolsStyle(DTab,colIDs,bgstyle){
	// Set background color in multi cols of a datatable
	var nrow= DTab.getNumberOfRows();
	var idx,r;
	for (idx in colIDs) {
		for (r=0;r<nrow;r++) {
			DTab.setProperty(r,colIDs[idx],'style',bgstyle);
		}
	}
}
