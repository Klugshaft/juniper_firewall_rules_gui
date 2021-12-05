// JavaScript source code

let getNatMode = () => {

    return document.querySelector('input[name=natmode]:checked').value;
}

function clearTXTAreaObjs(objId) {

    document.getElementById(objId).innerHTML = "";

};

let natForm = document.getElementById("NATPolicyForm");

let snatPoolvar = () => {
    return { 
        snat_pool_name: natForm.snatpoolname.value,
        snat_addr: natForm.src_nat_pool_addr.value,
        snat_port: natForm.src_nat_port.value,
        snat_opt: natForm.srcnat_opts.value,
        src_nat_addr_status: natForm.srcnatip_checkbox,
        src_nat_port_status: natForm.srcnatport_checkbox,
        srcnatopt_status: natForm.srcnatopt_checkbox
    }
}

function gen_source_nat_pool() {

    // var form = document.getElementById("NATPolicyForm");
    let nat = snatPoolvar();
    let natRule = document.getElementById("nat_rules");
    let natMode = getNatMode();

    if (natMode == "source") {
        
        if (nat.src_nat_addr_status.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} pool ${nat.snat_pool_name} address ${nat.snat_addr}\n`;
        }
        if (nat.src_nat_port_status.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} pool ${nat.snat_pool_name} port ${nat.snat_port}\n`;
        }
        if (nat.srcnatopt_status.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} pool ${nat.snat_pool_name} ${nat.snat_opt}\n`;
        }
    } else alert("Please select source nat mode!!")
}

let dnatPoolvar = () => {
    return {
        dnat_pool_name: natForm.dnatpoolname.value,
        dnat_addr : natForm.dst_nat_pool_addr.value,
        dnat_port : natForm.dst_nat_port.value,
        dst_nat_addr_status : natForm.dstnatip_checkbox,
        dst_nat_port_status : natForm.dstnatport_checkbox
    }
}
function gen_dest_nat_pool() {
   
    let nat = dnatPoolvar();
    let natRule = document.getElementById("nat_rules");
    let natMode = getNatMode();

    if (natMode == "destination") {

        if (nat.dst_nat_addr_status.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} pool ${nat.dnat_pool_name} address ${nat.dnat_addr}\n`;
        }
        if (nat.dst_nat_port_status.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} pool ${nat.dnat_pool_name} address port ${nat.dnat_port}\n`;
        }
    } else alert("Please select destination nat mode!!")

}

let snatRuleObjs = () => {
    return {
         
        rule_set_desc: natForm.rule_set_desc.value,
        rule_set_name : natForm.rule_set_name.value,
        rule_name : natForm.rule_name.value,
        rule_name_desc : natForm.rule_name_desc.value,
        src_addr_list : natForm.src_addr_list.value.split(","),
        dst_addr_list : natForm.dst_addr_list.value.split(","),
        src_objname_list : natForm.src_objname_list.value.split(","),
	dst_objname_list : natForm.dst_objname_list.value.split(","),
        frmzone : natForm.from_zone.value,
        tozone : natForm.to_zone.value,
        from_intf : natForm.from_intf.value,
        Route_Instance : natForm.Route_Instance.value,
        dest_port : natForm.dest_port.value,
        snat_pool_name : natForm.snatpoolname.value,
        dnat_pool_name : natForm.dnatpoolname.value,
        app_name: natForm.app_name.value,
        mapped_port : natForm.mapped_port.value,
        address_prefix : natForm.address_prefix.value,
        natOff : natForm.nat_off

    }

}

function gen_srcnat_rules() {

    let nat = snatRuleObjs();
    let natMode = getNatMode();
    let natRule = document.getElementById("nat_rules");

    if (natMode == "source") {

        if (nat.Route_Instance != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from ${nat.Route_Instance}\n`;
        }

        if (nat.from_intf != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from interface ${nat.from_intf}\n`;
        }

        if (nat.rule_set_desc != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} description ${nat.rule_set_desc}\n`;
        }
        if (nat.rule_name_desc != "") {

            nat_rules.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} description ${nat.rule_name_desc}\n`;
        }

        if (nat.frmzone != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from zone ${nat.frmzone}\n`;
        }

        if (nat.tozone != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} to zone ${nat.tozone}\n`;
        }

        if (nat.src_addr_list != "") {
            for (const srcAddr of nat.src_addr_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address ${srcAddr}\n`;
            }
        }
        
        if (nat.src_objname_list != "") {
            for (const srcObj of nat.src_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address-name ${srcObj}\n`;
            }
        }


        if (nat.dst_addr_list != "") {
            for (const dstObj of nat.dst_addr_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address ${dstObj}\n`;
            }
        }
        
        if (nat.dst_objname_list != "") {
            for (const dstAddr of nat.dst_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address-name ${dstAddr}\n`;
            }
        }
        
        if (nat.app_name != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match application ${nat.app_name}\n`;
        }
        if (nat.dest_port != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destintaion-port ${nat.dest_port}\n`;
        }

        if (nat.natOff.checked == true) {
                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then source-nat off \n`;
        }

        if (nat.snat_pool_name != "") {
                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then source-nat pool ${nat.snat_pool_name}\n`
        }

    } else
        alert("Please select source nat mode!!");
}




function gen_dstnat_rules() {

  
    let nat = snatRuleObjs();
    let natMode = getNatMode();
    let natRule = document.getElementById("nat_rules");

    if (natMode == "destination") {

        if ( nat.Route_Instance != "" ) {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from ${nat.Route_Instance}\n`
        }

        if (nat.from_intf != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from interface ${nat.from_intf}\n`
        }

        if (nat.rule_set_desc != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} description ${nat.rule_set_desc}\n`
        }
        if (nat.rule_name_desc != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} description ${nat.rule_name_desc}\n`
        }

        if (nat.frmzone != "") {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from zone ${nat.frmzone}\n`
        }


        if (nat.src_addr_list != "") {
            for ( const srcAddr of nat.src_addr_list ) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address ${srcAddr}\n`
            }
        }
        
        if (nat.src_objname_list != "") {
            for (const srcObj of nat.src_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address-name ${srcObj}\n`;
            }
        }


        if (nat.dst_addr_list != "") {
            for ( const dstAddr of nat.dst_addr_list ) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address ${dstAddr}\n`
            }
        }
        
        if (nat.dst_objname_list != "") {
            for (const dstObj of nat.dst_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address-name ${dstObj}\n`;
            }
        }
        
        
        if (nat.app_name != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match application ${nat.app_name}\n`
        }
        if (nat.dest_port != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destintaion-port ${nat.dest_port}\n`
        }

        if (nat_off.checked == true) {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then destination-nat off\n`
        }

        if (nat.dnat_pool_name != "") {
            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then destination-nat pool ${nat.dnat_pool_name}\n`
        }
    } else alert("Please select destination nat mode!!")

}





function gen_static_nat_rules() {
   
    let nat = snatRuleObjs();
    let natMode = getNatMode();
    let natRule = document.getElementById("nat_rules");

    if (nat.Route_Instance != "") {
        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from ${nat.Route_Instance}\n`
    }

    if (nat.from_intf != "") {
        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from interface ${nat.from_intf}\n`
    }

    if (nat.rule_set_desc != "") {

        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} description ${nat.rule_set_desc}\n`
    }
    if (nat.rule_name_desc != "") {

        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} description ${nat.rule_name_desc}\n`
    }

    if (nat.frmzone != "") {

        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} from zone ${nat.frmzone}\n`
    }


    if (nat.src_addr_list != "") {
        for (const srcAddr of nat.src_addr_list) {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address ${srcAddr}\n`
        }
    }
    
     if (nat.src_objname_list != "") {
            for (const srcObj of nat.src_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match source-address-name ${srcObj}\n`;
            }
      }


    if (nat.dst_addr_list != "") {
        for (const dstAddr of nat.dst_addr_list) {

            natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address ${dstAddr}\n`
        }
    }

    if (nat.dst_objname_list != "") {
            for (const dstObj of nat.dst_objname_list) {

                natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destination-address-name ${dstObj}\n`;
            }
    }
     
    

    if (nat.dest_port != "") {
        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} match destintaion-port ${nat.dest_port}\n`
    }


    natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then static-nat prefix ${nat.address_prefix}\n`


    if (nat.mapped_port != "") {
        natRule.innerHTML += `set security nat ${natMode} rule-set ${nat.rule_set_name} rule ${nat.rule_name} then static-nat prefix mapped-port ${nat.mapped_port}\n`
    }

}

let proxyArpObjs = () => {
    return {
        intf: natForm.from_intf.value,
        proxy_arp_checkbox_status: natForm.proxy_arp_checkbox,
        proxy_arp_ip: natForm.proxy_arp_ip.value
    }
}

function proxy_arp_cmd() {

    let proxyArpObj = proxyArpObjs();
    // let natMode = getNatMode();
    let nat_rule = document.getElementById("nat_rules");

    if (proxyArpObj.proxy_arp_checkbox_status.checked == true) {
        nat_rule.innerHTML += `set security nat proxy-arp interface ${proxyArpObj.intf} address ${proxyArpObj.proxy_arp_ip}\n`
    }
}

document.getElementById("myfooter").innerHTML = `Private internal use only, not for public distirbution! Copyright &copy 2020 by Calvin Kwok\n`;
