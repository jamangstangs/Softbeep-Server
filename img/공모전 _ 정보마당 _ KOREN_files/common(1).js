
String.prototype.replaceAll = function(va,re) { 
	var reValue = this; 

	while(reValue.search(va)  > -1) 
		reValue = reValue.replace(va,re); 
	
	return reValue; 
} 

//영문숫자 체크
function fnWordCHK(evt) {
	var reg = /^[a-zA-Z0-9]+$/;
	var reg_exp = /^[a-zA-Z0-9]{4,12}$/;
	var pwd = event.srcElement.value;
	if (!reg_exp.test(pwd)) {
		return false;
	}else{
		return true;
	}
}

function gourl(val,val2){
	if (val2 == ''){
		location.href=val;
	}else{
		eval(val2).location.href=val;
	}
}

function fnABCchk(val){
    var SamePass_0 = 0; //동일문자 카운트
    var SamePass_1 = 0; //연속성(+) 카운드
    var SamePass_2 = 0; //연속성(-) 카운드
    
    var chr_pass_0;
    var chr_pass_1;
    var chr_pass_2;
   
    for(var i=0; i < val.length; i++)
    {
        chr_pass_0 = val.charAt(i);
        chr_pass_1 = val.charAt(i+1);
        
        //동일문자 카운트
        if(chr_pass_0 == chr_pass_1)
        {
            SamePass_0 = SamePass_0 + 1
        }
       
        chr_pass_2 = val.charAt(i+2);
        //연속성(+) 카운드

        if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1)
        {
            SamePass_1 = SamePass_1 + 1
        }
        
        //연속성(-) 카운드
        if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1)
        {
            SamePass_2 = SamePass_2 + 1
        }
    }

    if(SamePass_0 > 1)
    {
        return false;
    }
   
    if(SamePass_1 > 1 || SamePass_2 > 1 )
    {
        return false;
    }
 return true;
}

function checkPass(pw){
	var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var number = "1234567890";
	var sChar = "!@#$^()~;:`";

	var sChar_Count = 0;
	var alphaCheck = false;
	var numberCheck = false;

	if(4 <= pw.length || pw.length <= 20){
		for(var i=0; i<pw.length; i++){
			if(sChar.indexOf(pw.charAt(i)) != -1){
				sChar_Count++;
			}
			if(alpha.indexOf(pw.charAt(i)) != -1){
				alphaCheck = true;
			}
			if(number.indexOf(pw.charAt(i)) != -1){
				numberCheck = true;
			}
		}//for
		if(sChar_Count < 1 || alphaCheck != true || numberCheck != true){
			return false;
		}//if
	}else{
		return false;
	}
	return true;
} 


function getid(form) {
	if (document.getElementById("saveid")) {
		if (getCookie("saveid") != undefined) {
			form.saveid.checked = ((form.tMemID.value = getCookie("saveid")) != "");
			//if(form.saveid.checked) document.getElementById("tMemID").style.background = "";
		}		
	}
}

function getCookie(uName) {

	var flag = document.cookie.indexOf(uName + '=');

	if (flag != -1) {
		flag += uName.length + 1
		end = document.cookie.indexOf(';', flag)

		if (end == -1) end = document.cookie.length
		return unescape(document.cookie.substring(flag, end))
	}
}

function setCookie(name, value, expiredays) {
	//alert('aaa');
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie　 = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function saveId(form) {
	var expdate = 0;
	// 기본적으로 30일동안 기억하게 함. 일수를 조절하려면 * 30에서 숫자를 조절하면 됨
	if (form.saveid.checked) {
		expdate = 30;
	} else {
		expdate = 0;
	}
	setCookie("saveid", form.tMemID.value, expdate);
}

function fnLeft(str,ea){
	var rslt = str.substr(0,ea);  //substr 은 어디서부터 몇개, substring 는 어디서부터 어디까지
	return rslt;
}

function fnRight(str,ea){
  var alen = str.length;
  var rsrt = str.substr(alen-ea,ea);
  return rsrt;
}


function isNumeric(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s == '' || isNaN(s)) return false;
  return true;
}

//3자리 콤마
function toCurrencyString(strCurrency) { 
	strCurrency += ""; 
	strCurrency = strCurrency.replace(/^\s*|\s*$/g, '');	// 좌우 공백 제거
	strCurrency = strCurrency.replaceAll(",","");
	var isMinus = false; 
	var isDot   = false; 
	var sSecond = "";      //정수의 문자열 
	var sDot    = "";      //소수점이하의 문자열 

	if(strCurrency.charAt(0) == '-') { strCurrency = strCurrency.substring(1); isMinus = true; } 

	if(strCurrency.indexOf(".", 0) > 0) { 
		sSecond = strCurrency.substr(0, strCurrency.indexOf(".", 0)); 
		sDot = strCurrency.substring(strCurrency.indexOf(".", 0), strCurrency.length); 
		isDot = true; 
		var len = sDot.length - 1; 

		if (len > 2) { 
			//            alert("소수점 이하는2자리만 가능합니다."); 
			//            inField.focus(); 
			//            return false; 
			sDot = sDot.substr(0, sDot.length - 1); 
		} 
		strCurrency = sSecond; 
	} 
	strlen  = strCurrency.length; 
	cntLoop = Math.floor(strlen / 3); 
	rem     = strlen % 3; 
	
	if(rem == 0) { rem = 3; cntLoop--; } 

	result = strCurrency.substr(0, rem); 
	
	for(ipos = 0 ; ipos < cntLoop ; ipos++) 
		result += "," + strCurrency.substr(3 * ipos + rem , 3); 

	if (isMinus) result = "-" + result; 

	if(isDot) result = result + sDot; 

	return result; 
} 




function fnMoneyKr(num) {	
    var hanA = new Array("","일","이","삼","사","오","육","칠","팔","구","십");
    var danA = new Array("","십","백","천","","십","백","천","","십","백","천","","십","백","천");
    var result = "";
	for(i=0; i<num.length; i++) {		
		str = "";
		han = hanA[num.charAt(num.length-(i+1))];
		if(han != "")
			str += han+danA[i];
		if(i == 4) str += "만 ";
		if(i == 8) str += "억 ";
		if(i == 12) str += "조 ";
		result = str + result;
	}
	if(num != 0)
		result = result + "원";
    return result ;
}


function checkBizID(bizID) { //사업자등록번호 유효성검사

	// bizID는 숫자만 10자리로 해서 문자열로 넘긴다.
	if (bizID.length != 10) {
		return false;
	}

	var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
	var i, chkSum=0, c2, remander;
	bizID = bizID.replace(/-/gi,'');

	for (i=0; i<=7; i++) {
		chkSum += checkID[i] * bizID.charAt(i);
	}

	c2 = "0" + (checkID[8] * bizID.charAt(8));
	c2 = c2.substring(c2.length - 2, c2.length);

	chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));

	remander = (10 - (chkSum % 10)) % 10;

	if (Math.floor(bizID.charAt(9)) == remander) {
		return true; // OK!
	} else {
		return false;
	}
} 


function jusoCallBack(Gubuntype,roadFullAddr,roadAddrPart1,addrDetail,roadAddrPart2,engAddr,jibunAddr,zipNo,admCd,rnMgtSn,bdMgtSn,detBdNmList,bdNm,bdKdcd,siNm,sggNm,emdNm,liNm,rn,udrtYn,buldMnnm,buldSlno,mtYn,lnbrMnnm,lnbrSlno,emdNo){
	document.getElementById('txtAddr1_'+Gubuntype).value = roadAddrPart1;
	document.getElementById('txtAddr2_'+Gubuntype).value = addrDetail;
	document.getElementById('txtZipCode_'+Gubuntype).value = zipNo;
	//document.getElementById('admCd').value = admCd;
	//document.getElementById('rnMgtSn').value = rnMgtSn;
	//document.getElementById('bdMgtSn').value = bdMgtSn;
	//document.getElementById('detBdNmList').value = detBdNmList;
	//**2017년 2월 추가 제공 **/
	//document.getElementById('bdNm').value = bdNm;
	//document.getElementById('bdKdcd').value = bdKdcd;
//	document.getElementById('siNm').value = siNm;
//	document.getElementById('sggNm').value = sggNm;
//	document.getElementById('emdNm').value = emdNm;
//	document.getElementById('liNm').value = liNm;
//	document.getElementById('rn').value = rn;
//	document.getElementById('udrtYn').value = udrtYn;
//	document.getElementById('buldMnnm').value = buldMnnm;
//	document.getElementById('buldSlno').value = buldSlno;
//	document.getElementById('mtYn').value = mtYn;
//	document.getElementById('lnbrMnnm').value = lnbrMnnm;
//	document.getElementById('lnbrSlno').value = lnbrSlno;
//	/**2017년 3월 추가 제공 **/
//	document.getElementById('emdNo').value = emdNo;
}

function goPopup(tp){
	// 주소검색을 수행할 팝업 페이지를 호출합니다.
	// 호출된 페이지(jusoPopup_utf8.asp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrLinkUrl.do)를 호출하게 됩니다.
	var pop = window.open("/lib/Common/COM/jusoPopup.asp?tp="+tp,"pop","width=570,height=420, scrollbars=yes, resizable=yes");

	// 모바일 웹인 경우, 호출된 페이지(jusoPopup_utf8.asp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrMobileLinkUrl.do)를 호출하게 됩니다.
    //var pop = window.open("/jusoPopup_utf8.asp","pop","scrollbars=yes, resizable=yes");
}

function goPopupNo(tp){
	// 주소검색을 수행할 팝업 페이지를 호출합니다.
	// 호출된 페이지(jusoPopup_utf8.asp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrLinkUrl.do)를 호출하게 됩니다.
	var pop = window.open("/lib/Common/COM/jusoPopupNo.asp?tp="+tp,"pop","width=570,height=420, scrollbars=yes, resizable=yes");

	// 모바일 웹인 경우, 호출된 페이지(jusoPopup_utf8.asp)에서 실제 주소검색URL(http://www.juso.go.kr/addrlink/addrMobileLinkUrl.do)를 호출하게 됩니다.
    //var pop = window.open("/jusoPopup_utf8.asp","pop","scrollbars=yes, resizable=yes");
}



function fnFileNameFilter(val){
	var re = /[$*\/",'&\s<?|>\#]/gi; 
	var temp=val;
	if(re.test(temp)){ //특수문자가 포함되면 삭제하여 값으로 다시셋팅
		alert('파일명으로 사용하실 수 없는 특수문자[$*\/"\',&<?|>\#] 혹은 띄어쓰기가 있습니다.\n파일명 변경 후 다시 업로드하여 주세요.');
		return false;
	}else{
		return true;
	}
}


//전체 선택
function checkAll()
{
	var i;
	var Obj = document.all['chkIdx'];
    var ObjLength = Obj.length;
	if(!ObjLength)
    {
        //**    한개일때 처리
       if (document.ListForm.chkIdx.checked == true)
		{
			document.ListForm.chkIdx.checked = false;
		}
		else
		{
			document.ListForm.chkIdx.checked = true ;
		}
    }
    else
    {
        //**    여러개 일때 처리
		for(i=0; i<document.ListForm.chkIdx.length; i++)
		{
			if (document.ListForm.chkIdx[i].checked == true)
			{
				document.ListForm.chkIdx[i].checked = false;
			}
			else
			{
				document.ListForm.chkIdx[i].checked = true ;
			}
		}
	}
}  


function ListCheck()
{
	var Count_User ;
	Count_User = 0 ;

	var Obj = document.all['chkIdx'];
	
	if(Obj=='undefined' || Obj==null)
	{
		alert('대상을 선택해 주세요.');
		return false;
	}

    var ObjLength = Obj.length;
}


// JQuery ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


$(document).ready(function(){
	//$.LoadingOverlaySetup({size : "10"});
	//$("body").LoadingOverlay("show",{background:"rgba(255, 255, 255, 0.96)"});

	// 인풋박스 숫자 제한 체크
	$(document).on("keyup", ".amt", function() {
		$(this).val( $(this).val().replace(/[^0-9.,]/gi,""));
	});
	$(document).on("keyup", ".amt2", function() {
		$(this).val( $(this).val().replace(/[^0-9.]/gi,""));
	});
	$(document).on("keyup", ".chknum", function() {
		$(this).val( $(this).val().replace(/[^0-9]/gi,""));
	});
	$(document).on("keyup", ".chknum2", function() {
		$(this).val( $(this).val().replace(/[^0-9-]/gi,""));
	});
		
	$(document).on("keyup", ".dchk", function() {
		$(this).val( $(this).val().replace(/[^0-9-]/gi,""));
	});
	$(document).on("keyup", ".pwchk", function() {
		$(this).val( $(this).val().replace(/[^0-9A-Za-z]/gi,""));
	});

	$(document).on("keyup", ".comma", function() {
		var oVal = $(this).val();
		var comVal = '';
		comVal = toCurrencyString( oVal );
		$(this).val(comVal);
	});

	//특수문자 필터링
	$(document).on("keyup", ".chksp", function() {
		var re = /[~?|&%@*\="'\/<>\#]/gi; 
		 var temp=$(this).val();
		 if(re.test(temp)){ //특수문자가 포함되면 삭제하여 값으로 다시셋팅
			var temp1 = temp.substr(0,temp.length -1 );
			alert('사용할 수없는 특수문자[ ~?|&%@*\="\'\/<>\# ]가 포함되어 있습니다.');
			$(this).val(temp1);
			return false;
		 }
	});
	//특수문자 필터링
	$(document).on("keyup", ".chksp2", function() {
		var re = /[$*"'<>\#]/gi; 
		 var temp=$(this).val();
		 if(re.test(temp)){ //특수문자가 포함되면 삭제하여 값으로 다시셋팅
			var temp1 = temp.substr(0,temp.length -1 );
			alert('사용할 수없는 특수문자[ $*"\'<>\# ]가 포함되어 있습니다.');
			$(this).val(temp1);
			return false;
		 }

	});

	//특수문자 필터링
	$(document).on("keyup", ".chksp3", function() {
		var re = /[^0-9A-Za-z!@\#$\^()~;:`]/gi; 
		 var temp=$(this).val();
		 if(re.test(temp)){ //영문숫자
			var temp1 = temp.substr(0,temp.length -1 );
			alert('영문/숫자/특수(!@#$^()~;:`)만 사용가능 합니다.');
			$(this).val(temp1);
		 }
	});

	//특수문자 필터링
	$(document).on("keyup", ".chkspace", function() {
		var re = /\s/gi; 
		 var temp=$(this).val();
		 if(re.test(temp)){ //특수문자가 포함되면 삭제하여 값으로 다시셋팅
			var temp1 = temp.substr(0,temp.length -1 );
			alert('띄어쓰기를 사용할 수 없습니다.');
			$(this).val(temp1);
			return false;
		 }

	});

	//특수문자 필터링
	$(document).on("keyup", ".chkpassword", function() {
		var re = /[^0-9A-Za-z]/gi; 
		 var temp=$(this).val();
		 if(re.test(temp)){ //영문숫자
			var temp1 = temp.substr(0,temp.length -1 );
			alert('영문/숫자만 사용가능 합니다.');
			$(this).val(temp1);
		 }
	});


	// 컬러박스 닫기버튼
	$(document).on("click", ".cboxclose", function() {
		parent.jQuery.colorbox.close();
	});
	
	// 팝업
	$(document).on("click", ".popclose", function() {
		//opener.location.reload();
		self.close();
	});

	//검색시 검색어 엔터 검색박스에 클레스 추가
	$(document).on("keydown", ".schKeyEnter", function(e) {
		if(e.keyCode == 13){
			schFormSubmit();
		}
	});

	//검색폼시 셀렉트 박스 선택시 검색이동
	$(document).on("change", ".schChange", function(e) {
		schFormSubmit();
	});
	
	//검색폼시 라이오,첵크 박스 선택시 검색이동
	$(document).on("click", ".schClick", function(e) {
		schFormSubmit();
	});
	
	
	//검색폼시 달력 값초기화
	$(document).on("click", "#btnCalRedo", function() {
		$('#selSdate').val('');
		$('#selEdate').val('');
		$( "#selSdate" ).datepicker( "option", "minDate", '' );
		$( "#selSdate" ).datepicker( "option", "maxDate", '' );
		$( "#selEdate" ).datepicker( "option", "minDate", '' );
		$( "#selEdate" ).datepicker( "option", "maxDate", '' );
	});
	
});

$(window).load(function(){
	//$('body').LoadingOverlay("hide");
});

function download(mval, mval2)
{
	var url = '/lib/Common/COM/FileDownload.asp?txtFileT=' + mval + '&txtIdx=' + mval2;
	location.href = url
}
	
function downloadSample(mval, mval2, mval3)
{
	var url = '/lib/Common/COM/FileDownload.asp?txtFileT=' + mval + '&txtIdx=' + mval2 + '&txtcode=' + mval3;
	location.href = url
}


// 메일 보내기
function mailSend()
{
	var Count_User ;
	Count_User = 0 ;

	var Obj = document.all['selChk'];
	
	if(Obj=='undefined' || Obj==null)
		{
			alert('메세지를 보낼 사람이 없습니다.');
			return false;
		}

    var ObjLength = Obj.length;

	if(!ObjLength)
    {
        //**    한개일때 처리

       if (document.frmSearch.selChk.checked == true)
		{
			Count_User = Count_User + 1 ;
		}
    }
	else {
		for(i=0; i<document.frmSearch.selChk.length; i++)
		{
			if (document.frmSearch.selChk[i].checked == true)
			{
				Count_User = Count_User + 1 ;
			}
		}
	}

	if (document.frmSearch.selType[0].checked==true) //.value == "MAIL")
	{

		if (Count_User < 1)
		{
			alert('메세지를 보낼 사람을 선택하세요!!');
			return false;
		}
	
		//제목을 입력하지 않을경우 처리
		if(document.frmSearch.txtTitle.value == "")
		{
			alert('제목을 입력하세요!!');
			document.frmSearch.txtTitle.focus();
			return false;
		}
			
		// 내용을 입력하지 않을경우의 처리
		if(document.frmSearch.txtComment.value == "")
		{
			alert('내용을 입력하세요!!');
			document.frmSearch.txtComment.focus();
			return false;
		}
	}
	else if (document.frmSearch.selType[1].checked==true)
	{

		if (Count_User < 1)
		{
			alert('메세지를 보낼 사람을 선택하세요!');
			return false;
		}			
		// 내용을 입력하지 않을경우의 처리
		if(document.frmSearch.txtComment.value == "")
		{
			alert('내용을 입력하세요!!');
			document.frmSearch.txtComment.focus();
			return false;
		}

		//alert("현재 SMS발송은 지원하지 않습니다");
		//return false;
	}
	else 	if (document.frmSearch.selType[2].checked==true) //.value == "CALL")
	{

		if (Count_User < 1)
		{
			alert('전화상담 대상을 선택하세요!!');
			return false;
		}
	
		//제목을 입력하지 않을경우 처리
		if(document.frmSearch.txtTitle.value == "")
		{
			alert('제목을 입력하세요!!');
			document.frmSearch.txtTitle.focus();
			return false;
		}
			
		// 내용을 입력하지 않을경우의 처리
		if(document.frmSearch.txtComment.value == "")
		{
			alert('내용을 입력하세요!!');
			document.frmSearch.txtComment.focus();
			return false;
		}
	}
	else
	{
		alert('전송방식을 선택하지 않았습니다.');
		document.frmSearch.selType[0].focus();
		return false;
	}
	//	return true;
	document.frmSearch.action="/lib/Common/COM/MS_Send.asp"
	document.frmSearch.submit();
}

function cal_pre()
{
	var tmpStr, tcount; 
	tmpStr = document.frmSearch.txtComment.value;

	if (document.frmSearch.selType[1].checked==true) //.value == "SMS")
	{
		document.frmSearch.cbyte.value = LenH(document.frmSearch.txtComment.value);

	}
}

function cal_byte(val, val2){
	var tcount;
    tcount = 0;
	    
    tcount = LenH($("#"+val+"").val()); 
	
	$("#"+val2+"").val(tcount);
}

function LenH(aquery)
{
    var tmpStr;
    var temp=0;
    var onechar;
    var tcount;
    tcount = 0;
	     
    tmpStr = new String(aquery);
    temp = tmpStr.length;
	
    for (k=0;k<temp;k++)
    {
        onechar = tmpStr.charAt(k);
	
        if (escape(onechar).length > 4) {
            tcount += 2;
        }
        else if (onechar!='\r') {
            tcount++;
        }
    }
    return tcount;
}

function blockKeyEnter(e) {
	var e = window.event || e;
	if (e.keyCode == 13) e.keyCode = 0;
}

function changeImgRegAuto(item) {
	if (item.checked) {
		document.getElementById("imgRegManualMiddle").style.display = "none";
		document.getElementById("imgRegManualSmall").style.display = "none";
	}
	else {
		document.getElementById("imgRegManualMiddle").style.display = "";
		document.getElementById("imgRegManualSmall").style.display = "";
	}
}

function addRowOpt(kind) {

	var optCount = 0;
	var optMaxCount = 0;
	optCount = Number($("#optionCount").val());
	optMaxCount = Number($("#optionMaxCount").val());

	kind = optMaxCount;

	var tableID = "tbOpt";

	var objTb = document.getElementById(tableID);
	var tbRowsLen = objTb.rows.length;

	if (typeof(arrCellHtmlOpt) == "undefined") {
		alert("페이지 로딩중 입니다.");
		return false;
	}

	if (maxRowOpt+1 <= tbRowsLen) {
		alert("더 이상 추가할 수 없습니다.\n\n최대 "+maxRowOpt+"개까지 추가할 수 있습니다.");
		return false;
	}

	var objTbRow = objTb.insertRow(tbRowsLen);

	for(i=0; i<arrCellHtmlOpt.length; i++) {
		objTbRowCell = objTbRow.insertCell(i);
		objTbRowCell.innerHTML = arrCellHtmlOpt[i].replaceAll('#OPTIONKIND#', kind+1);
	}

	
	$("#optionCount").val(optCount + 1);
	$("#optionMaxCount").val(optMaxCount + 1);
}

function delRowOpt(obj, kind) {

	var indexNo = $(obj).closest("tr").prevAll().length-2;
	//var indexNo = kind;

	var optCount = 0;
	optCount = Number($("#optionCount").val());

	if (optCount != 1)
	{
		var tableID = "tbOpt";
		var currIdx = getDisObjIdx(kind);

		var objTb = document.getElementById(tableID);

		objTb.deleteRow(indexNo);

		if (objTb.rows.length == 1) addRowOpt(kind);
		
		optCount = Number($("#optionCount").val());
		$("#optionCount").val(optCount - 1);
	}
}

function addRowImage(kind) {

	var optCount = 0;
	var optMaxCount = 0;
	optCount = Number($("#imageCount").val());
	optMaxCount = Number($("#imageMaxCount").val());

	kind = optMaxCount;

	var tableID = "tbImage";

	var objTb = document.getElementById(tableID);
	var tbRowsLen = objTb.rows.length;

	if (typeof(arrCellHtmlImage) == "undefined") {
		alert("페이지 로딩중 입니다.");
		return false;
	}

	if (maxRowOpt+1 <= tbRowsLen) {
		alert("더 이상 추가할 수 없습니다.\n\n최대 "+maxRowOpt+"개까지 추가할 수 있습니다.");
		return false;
	}

	var objTbRow = objTb.insertRow(tbRowsLen);

	for(i=0; i<arrCellHtmlImage.length; i++) {
		objTbRowCell = objTbRow.insertCell(i);
		objTbRowCell.innerHTML = arrCellHtmlImage[i].replaceAll('#IMAGEKIND#', kind+1);
	}

	
	$("#imageCount").val(optCount + 1);
	$("#imageMaxCount").val(optMaxCount + 1);
}

function delRowImage(obj, kind) {

	var indexNo = $(obj).closest("tr").prevAll().length-2;

	var optCount = 0;
	optCount = Number($("#imageCount").val());

	if (optCount != 1)
	{
		var tableID = "tbImage";
		var currIdx = getDisObjIdx(kind);

		var objTb = document.getElementById(tableID);

		objTb.deleteRow(indexNo);

		if (objTb.rows.length == 1) addRowOpt(kind);
		
		optCount = Number($("#imageCount").val());
		$("#imageCount").val(optCount - 1);
	}
}

// 현재 이벤트객체 Index 가져오기 ##################################################
function getDisObjIdx(obj) {
	var i = 0;
	var result = 0;

	var arrTag = document.getElementsByTagName('*');

	if (obj.sourceIndex) {
		while (arrTag[i].sourceIndex < obj.sourceIndex) {
			if (arrTag[i].id == obj.id) ++result;
			++i;
		}
	}
	else if (obj.compareDocumentPosition) {
		while ((arrTag[i].compareDocumentPosition(obj) & 6) - 3 > 0) {
			if (arrTag[i].id == obj.id) ++result;
			++i;
		}
	}

	return result;
}

function cellHtmlOptInit() {
	arrCellHtmlOpt = new Array();
	arrCellHtmlOpt[0] = "<div class=\"col-xs-12\"><input type=\"text\" name=\"optTitle#OPTIONKIND#\" class=\"col-xs-12 chksp\" maxlength=\"50\"/></div>"
	arrCellHtmlOpt[1] = "<div class=\"col-xs-12\"><input type=\"text\" name=\"optDetail#OPTIONKIND#\" class=\"col-xs-12 chksp\" maxlength=\"100\"/></div>"
	arrCellHtmlOpt[2] = "<div class=\"col-xs-12\"><input type=\"text\" name=\"optStock#OPTIONKIND#\" class=\"col-xs-10 chknum mgr_10\" maxlength=\"15\" /><span class=\"lbl\"> 개</span></div>"
	arrCellHtmlOpt[3] = "<div class=\"col-xs-12\"><input type=\"text\" name=\"optPrice#OPTIONKIND#\" class=\"col-xs-10 chknum mgr_10\" maxlength=\"15\" /><span class=\"lbl\"> 원</span></div>"
	arrCellHtmlOpt[4] = "<div class=\"col-xs-12\"><input type=\"text\" name=\"optSort#OPTIONKIND#\" class=\"col-xs-10 chknum mgr_5\" maxlength=\"3\" /></div>"
	arrCellHtmlOpt[5] = "<div class=\"col-xs-12\"><select class=\"col-xs-12 rmg5\" name=\"optState#OPTIONKIND#\" ><option value=\"Y\" selected >사용</option><option value=\"N\" >미사용</option></select></div>"
	arrCellHtmlOpt[6] = "<div class=\"col-xs-12\"><span class=\"button small black\"><button type=\"button\" id=\"delOpt\" onClick=\"delRowOpt(this, '#OPTIONKIND#')\" >삭제</button></span></div>"
}

function cellHtmlOptInitImage() {
	arrCellHtmlImage = new Array();
	arrCellHtmlImage[0] = "<div class=\"col-xs-12\"><input type=\"file\" name=\"optImg#IMAGEKIND#\" style=\"width:300px\" onKeyPress=\"blockKey(event)\" onKeyDown=\"blockKey(event)\"/></div>"
	arrCellHtmlImage[1] = "<div class=\"col-xs-12\"><span class=\"button small black\"><button type=\"button\" id=\"delOpt\" onClick=\"delRowImage(this, '#IMAGEKIND#')\" >삭제</button></span></div>"
}

// 파일 다운로드 
// tableNm, index, id
function download(mval, mval2, mval3)
{
	var url = '/lib/Common/COM/Down.asp?txtTN=' + mval + '&txtIN=' + mval2 + '&txtUN=' + mval3;
	location.href = url
}



	// 컬러박스 닫기함수
function fnColorboxClose(){
		parent.jQuery.colorbox.close();
}

// 매장 및 가맹점 매입 담당자 추가

		function fnBuyerList(){

			var tComid = $('#Idx').val();

			if (tComid == ''){
				alert('등록할 매입담당자 정보를 정확하게 입력하세요.');
				return false;
			}

			$.post('/lib/Common/Com/CommonAjax.asp',{
				 tType:'BUYERLIST'
				,tComid	:	escape(tComid)

				},function(data,status){
					if (status == 'success'){
						$('.aByerArea').html(data)
					}else{
						alert(data);
					}
				}
			);
		}

		$(document).on('click','.btnDel',function (){
			var tBuyerID = $(this).attr('data-id');

			if (tBuyerID == ''){
				alert('삭제할 매입담당자 정보가 없습니다.');
				return false;
			}

			$.post('/lib/Common/Com/CommonAjax.asp',{
				 tType:'BUYERDEL'
				,tBuyerID	:	escape(tBuyerID)

				},function(data,status){
					if (status == 'success'){
						if (data=='SECCESS'){
							fnBuyerList()
							alert('삭제되었습니다..');
						}else{
							alert(data);
						}
					}else{
						alert(data);
					}
				}
			);
		});


		$(document).on('click','#btnBuyerAdd',function (){
			var tComid = $('#Idx').val();
			var tBuyerNM = $('#tBuyerNM').val();
			var tBuyerHP = $('#tBuyerHP').val();
			var tBuyerPW = $('#tBuyerPW').val();

			if (tComid == '' || tBuyerNM == '' || tBuyerHP == '' || tBuyerPW == '' ){
				alert('등록할 매입담당자 정보를 정확하게 입력하세요.');
				return false;
			}
			if (tBuyerNM.length < 2){
				alert('성명을 2자리 이상 입력하세요.');
				return false;
			}
			if (tBuyerHP.length < 8){
				alert('전화번호를 정확하게 입력하세요.');
				return false;
			}
			if (tBuyerPW.length < 4){
				alert('비밀번호는 4자리 이상 입력하세요.');
				return false;
			}

			$.post('/lib/Common/Com/CommonAjax.asp',{
				 tType:'BUYERADD'
				,tComid	:	escape(tComid)
				,tBuyerNM	:	escape(tBuyerNM)
				,tBuyerHP	:	escape(tBuyerHP)
				,tBuyerPW	:	escape(tBuyerPW)

				},function(data,status){
					if (status == 'success'){
						if (data=='SECCESS'){
							fnBuyerList()
							alert('등록되었습니다..');
						}else{
							alert(data);
						}
					}else{
						alert(data);
					}
				}
			);


		});

	const countDownTimer = function (id, date) {
		var _vDate = new Date(date); // 전달 받은 일자
		var _second = 1000;
		var _minute = _second * 60;
		var _hour = _minute * 60;
		var _day = _hour * 24;
		var timer;


		function showRemaining() {
			var now = new Date();
			var distDt = _vDate - now;
				if (distDt < 0) {
					clearInterval(timer);
					document.getElementById(id).textContent = '해당 이벤트가 종료 되었습니다!';
					return;
				}
			var days = Math.floor(distDt / _day);
			var hours = Math.floor((distDt % _day) / _hour);
			var minutes = Math.floor((distDt % _hour) / _minute);
			var seconds = Math.floor((distDt % _minute) / _second);

			//document.getElementById(id).textContent = date.toLocaleString() + "까지 : ";
			document.getElementById(id).textContent = days + '일 ';
			document.getElementById(id).textContent += hours + '시간 ';
			document.getElementById(id).textContent += minutes + '분 ';
			document.getElementById(id).textContent += seconds + '초';
		}

		timer = setInterval(showRemaining, 1000);
	}