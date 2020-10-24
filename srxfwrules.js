// script utilizes objects and factory function to reduce repetition of declaration of variables in functions
// ir also reduces the load time of page

let setcmd = function () {
    lsysName = document.getElementById("lsys").value
    return (lsysName == "") ? "set" : `set logical-systems ${lsysName}`
}

let clearTXTAreaObjs = function(objId) {

    document.getElementById(objId).innerHTML = "";

}

let clearInput = function(formObj) {
    // added reset form values 
    document.getElementById(formObj).reset();
}

// shared variables 
let ipObjForm = document.getElementById("fwAddrObjForm");
let svcObjForm = document.getElementById("fwSvcObjForm");
let fwPolicyForm = document.getElementById("fwPolicyForm");

let fwObjs = () => {
    return {
        addressObjs : ipObjForm.addrObjName.value.split(","),
        ipAddress : ipObjForm.ipAddr.value.split(","),
        addrBookname: ipObjForm.addrBookname.value,
        addrSetName: ipObjForm.addrSetname.value,
        addrBookName: ipObjForm.addrBookname.value
    }
};

// you can define constructor function below
//let svcobjs = function () {

//    this.portname = svcobjform.portname.value.split(",");
//    this.porttype = svcobjform.svcprotocol.value.split(",");
//    this.srcport = svcobjform.srcport.value.split(",");
//    this.portnum = svcobjform.destport.value.split(",");
//    this.svcsetname = svcobjform.svcset.value;
//    this.portlist = svcobjform.portname.value.split(",");
//    this.inactivetimer = svcobjform.inactivetimer.value;
//}

// using factory function to create new objects below, everytime the function is called all variables will be re-initialized
let svcObjs = () => {
    return {
        portName: svcObjForm.portname.value.split(","),
        portType: svcObjForm.SvcProtocol.value.split(","),
        srcPort: svcObjForm.srcport.value.split(","),
        portNum: svcObjForm.destport.value.split(","),
        svcSetName: svcObjForm.svcSet.value,
        portList: svcObjForm.portname.value.split(","),
        inactiveTimer: svcObjForm.inactivetimer.value
    }
};

let genAddrObjs = () => {

    let fwobj = fwObjs();
    document.getElementById("fwAddrObjTXT").innerHTML += `${setcmd()} security address-book ${fwobj.addrBookname} address ${fwobj.addressObjs[0]} ${fwobj.ipAddress[0]}\n`;
    
}


let createAddrSet = () => {

    let fwobj = fwObjs();
    for (const addrobj of fwobj.addressObjs) {

        document.getElementById("fwAddrObjTXT").innerHTML += `${setcmd()} security address-book ${fwobj.addrBookname} address-set ${fwobj.addrSetName} address ${addrobj}\n`;
    }

}

let genPortstatement = () => {

    let appobj = svcObjs();
    let fwsvctag = document.getElementById("fwSvcObjTXT");

    if (appobj.srcPort == "default") {

        fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} protocol ${appobj.portType[0]} destination-port ${appobj.portNum[0]}\n`;
    } else {
        fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} protocol ${appobj.portType[0]}  source-port ${appobj.srcPort[0]} destination-port ${appobj.portNum}\n`;
    }

    if (appobj.inactiveTimer != "default") {
        fwsvctag.innerHTML += `${setcmd()} applications application ${appobj.portName[0]} inactivity-timeout ${appobj.inactiveTimer}\n`;
    }
}

let createSvcSet = () => {

    let appobj = svcObjs();
    let fwsvctag = document.getElementById("fwSvcObjTXT");

    for (const eachapp of appobj.portList) {
        fwsvctag.innerHTML += `${setcmd()} applications application-set ${appobj.svcSetName} application ${eachapp}\n`;
    }
}


let genFwPolicy = () => {

    let isglobalpolicy = fwPolicyForm.globalpolicy.checked;

    if (isglobalpolicy == true) {

        genGlobalPolicy();

    } else {

        genSecPolicy();
    }

}

let fwPolicyObj = () => {
    return {
        policyName: fwPolicyForm.policyname.value,
        policyDesc: fwPolicyForm.policydesc.value,
        srcObjs: fwPolicyForm.source_object.value.split(","),
        fromZoneObjs: fwPolicyForm.from_zone.value.split(","),
        toZoneObjs: fwPolicyForm.to_zone.value.split(","),
        dstObjs: fwPolicyForm.destination_object.value.split(","),
        ports: fwPolicyForm.ports.value.split(","),
        policyAction: fwPolicyForm.action.value,
        logOpts: fwPolicyForm.log.value.split(","),
        cosVal: fwPolicyForm.cosval.value
    }
}

let genGlobalPolicy = () => {


    let policyObj = fwPolicyObj();
    let fwrtag = document.getElementById("fwrTXT");

    if (policyObj.policyDesc != "") {

        fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} description \"${policyObj.policyDesc}"\n`;
    }

    for (const srcAddrobj of policyObj.srcObjs) {

        fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match source-address ${srcAddrobj}\n`;
    }

    for (const dstAddrobj of policyObj.dstObjs) {
        fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match destination-address ${dstAddrobj}\n`;
    }

    for (const portobj of policyObj.ports) {
        fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match application ${portobj}\n`;
    }

    if (policyObj.fromZoneObjs == "" || policyObj.toZoneObjs == "") {
        // do nothing
    } else {

        for (const fromzoneobj of policyObj.fromZoneObjs) {
            fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match from-zone ${fromzoneobj}\n`;
        }
        for (const tozoneobj of policyObj.toZoneObjs) {
            fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} match to-zone ${tozoneobj}\n`;
        }
    }

    fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} then ${policyObj.policyAction}\n`;

    for (const logobj of policyObj.logOpts) {
        fwrtag.innerHTML += `${setcmd()} security policies global policy ${policyObj.policyName} then log ${logobj}\n`;
    }

}

let genSecPolicy = () => {


    let policyObj = fwPolicyObj();
    let fwrtag = document.getElementById("fwrTXT");

    if (policyObj.policyDesc != "") {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} description \"${policyObj.policyDesc}\"\n`;
    }

    for (const srcobj of policyObj.srcObjs) {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match source-address ${srcobj}\n`;
    }


    for (const dstobj of policyObj.dstObjs) {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match destination-address ${dstobj}\n`;
    }


    for (const port of policyObj.ports) {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} match application ${port}\n`;
    }


    if (policyObj.cosVal == 'none') {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction}\n`;
    } else {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then ${policyObj.policyAction} application-services application-traffic-control rule-set ${policyObj.cosVal}\n`;
    }

    for (const logobj of policyObj.logOpts) {
        fwrtag.innerHTML += `${setcmd()} security policies from-zone ${policyObj.fromZoneObjs[0]} to-zone ${policyObj.toZoneObjs[0]} policy ${policyObj.policyName} then log ${logobj}\n`;
    }

}

document.getElementById("myfooter").innerHTML = "Private use only, not for public distirbution! Copyright &copy 2020 by Calvin Kwok";
//document.getElementById("footAnchor").innerHTML = "mailto:cfykwok@gmail.com";
