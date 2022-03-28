// script utilizes objects and function expression to reduce repetition of declaration of variables in functions
// ir also reduces the load time of page

const setcmd = function() {
	lsysName = document.getElementById("lsys").value
	return( lsysName == "" ) ?  "set" :`set logical-systems ${lsysName}`
}

function clearTXTAreaObjs(objId) {
	
	document.getElementById(objId).innerHTML = "" ;

}

function clearInput(formObj) {
// added reset form values 
	document.getElementById(formObj).reset();
}


// shared variables 
const ipObjForm = document.getElementById("fwAddrObjForm") ;
const svcObjForm = document.getElementById("fwSvcObjForm") ;
const fwPolicyForm = document.getElementById("fwPolicyForm") ; 

const fwObjs = function() {
	return {
		
		addressObjs : ipObjForm.addrObjName.value.split(","),
		ipAddress : ipObjForm.ipAddr.value.split(","),
		addrBookname : ipObjForm.addrBookname.value,
		addrSetName : ipObjForm.addrSetname.value,
		addrBookName : ipObjForm.addrBookname.value
	}

}

const svcObjs = function() {
	
	return {
	
		portName : svcObjForm.portname.value.split(","),
		portType : svcObjForm.SvcProtocol.value.split(","),
		srcPort : svcObjForm.srcport.value.split(","),
		portNum : svcObjForm.destport.value.split(","),
		svcSetName : svcObjForm.svcSet.value,
		portList : svcObjForm.portname.value.split(","),
		inactiveTimer : svcObjForm.inactivetimer.value
	}
}

function genAddrObjs() {
	
	const fwobj = fwObjs();
	document.getElementById("fwAddrObjTXT").innerHTML +=  `${setcmd()} security address-book ${fwobj.addrBookname} address ${fwobj.addressObjs[0]} ${fwobj.ipAddress[0]}\n`;
	
}


function createAddrSet() {
	
	const fwobj = fwObjs();
	for (const addrobj of fwobj.addressObjs ) {

		document.getElementById("fwAddrObjTXT").innerHTML +=  `${setcmd()} security address-book ${fwobj.addrBookname} address-set ${fwobj.addrSetName} address ${addrobj}\n`;
	}

}

function genPortStatement() {
	
	const appobj = svcObjs();
	const fwsvctag = document.getElementById("fwSvcObjTXT");
	
	if ( appobj.srcPort == "default"  ) {
	
		fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} protocol ${appobj.portType[0]} destination-port ${appobj.portNum[0]}\n`;
	} else {
		fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} protocol ${appobj.portType[0]}  source-port ${appobj.srcPort[0]} destination-port ${appobj.portNum}\n`;
	}
	
	if (appobj.inactiveTimer != "default" ) {
		fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} inactivity-timeout ${appobj.inactiveTimer}\n` ;
	}	
}

function createSvcSet() {
	
	const appobj = svcObjs();
	const fwsvctag = document.getElementById("fwSvcObjTXT");
	
	for (const eachAppObj of appobj.portList ) {
		fwsvctag.innerHTML += `${setcmd()} applications application-set ${appobj.svcSetName} application ${eachAppObj}\n`;
	}
}


function genFwPolicy() {

	let isglobalpolicy = fwPolicyForm.globalpolicy.checked; 
		
	if (isglobalpolicy == true) {
	
		genGlobalPolicy();
		
	} else {
		
		genSecPolicy();
	}

}

const fwPolicyObj = () => {
	return {
		policyName : fwPolicyForm.policyname.value,
		policyDesc : fwPolicyForm.policydesc.value,
		srcObjs : fwPolicyForm.source_object.value.split(","),
		fromZoneObjs : fwPolicyForm.from_zone.value.split(","),
		toZoneObjs : fwPolicyForm.to_zone.value.split(","),
		dstObjs : fwPolicyForm.destination_object.value.split(","),
		ports : fwPolicyForm.ports.value.split(","),
		policyAction : fwPolicyForm.action.value,
		idpPolicyName : fwPolicyForm.idpPolicyName.value,
		logOpts : fwPolicyForm.log.value.split(","),
		cosVal : fwPolicyForm.cosval.value
	}
} 

function genGlobalPolicy() {


	const policyObj = fwPolicyObj();
	const fwtag = document.getElementById("fwrTXT");
	
	if ( policyObj.policyDesc != "" ) {
	
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} description \"${policyObj.policyDesc}\"\n`;
	}
	
	for (const srcAddrobj of policyObj.srcObjs ) { 
		
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match source-address ${srcAddrobj}\n`;
	}
	
	for (const dstAddrobj of policyObj.dstObjs ) {
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match destination-address ${dstAddrobj}\n`;
	}
	
	for (const portobj of policyObj.ports ) {
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match application ${portobj}\n`;
	}
	
	if ( policyObj.fromZoneObjs == "" || policyObj.toZoneObjs == "" ) {
		// do nothing
	} else {
		
			for (const fromzoneobj of policyObj.fromZoneObjs ) {
				fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match from-zone ${fromzoneobj}\n`;
			}
			for (const tozoneobj of policyObj.toZoneObjs ) {
				fwtag.innerHTML +=`${setcmd()} security policies global policy ${policyObj.policyName} match to-zone ${tozoneobj}\n`;
			}
	}
	
	// check for idp policy globalpolicy.checked
	if ( policyObj.idpPolicyName == "none" ) {
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} then ${policyObj.policyAction}\n`;
	} else {
		 fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} then ${policyObj.policyAction} application-services idp-policy ${policyObj.idpPolicyName}\n`;
	}		
	
	for (const logobj of policyObj.logOpts ) {
		fwtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} then log ${logobj}\n`;
    }

}

function genSecPolicy() {
	
	
	const policyObj = fwPolicyObj();
	const fwtag = document.getElementById("fwrTXT");
	
	if ( policyObj.policyDesc != "" ) {
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} description \"${policyObj.policyDesc}\"\n`;
	}
	
	for ( const srcobj of policyObj.srcObjs ) { 
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match source-address ${srcobj}\n`;
	}
	
	
	for ( const dstobj of policyObj.dstObjs ){
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match destination-address ${dstobj}\n`;
	}
	
	
	for ( const port of policyObj.ports ) {
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match application ${port}\n`;
	}
	
	
	if ( policyObj.cosVal == 'none' ) { 
		
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction}\n`;
		} else {
			fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction} application-services application-traffic-control rule-set ${policyObj.cosVal}\n`;
	}	
	
	if ( policyObj.idpPolicyName == "none" ) {
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction}\n`;
	} else {
		 fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction} application-services idp-policy ${policyObj.idpPolicyName}\n`;
	}
		 
	for ( const logobj of policyObj.logOpts ) {
		fwtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then log ${logobj}\n`;
   }

}

document.write("<footer class = 'footer' ><p><i>Distributed as free version, copyright &copy 2020 by <a href='mailto:cfykwok@gmail.com'>Calvin Kwok</a></i></p></footer>")
