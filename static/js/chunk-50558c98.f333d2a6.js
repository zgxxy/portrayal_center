(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-50558c98"],{"04ca":function(t,e,a){"use strict";a.d(e,"i",(function(){return i})),a.d(e,"j",(function(){return s})),a.d(e,"h",(function(){return c})),a.d(e,"k",(function(){return l})),a.d(e,"g",(function(){return u})),a.d(e,"a",(function(){return p})),a.d(e,"f",(function(){return d})),a.d(e,"e",(function(){return f})),a.d(e,"c",(function(){return m})),a.d(e,"d",(function(){return g})),a.d(e,"l",(function(){return b})),a.d(e,"b",(function(){return h}));a("99af");var o=a("b775"),r=a("e686"),n=a.n(r);function i(t,e,a,r,i){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/").concat(t),method:"post",params:{pageNo:e,pageSize:a,type:r},data:i})}function s(t,e,a,r){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/").concat(t),method:"post",params:{pageNo:e,pageSize:a},data:r})}function c(t,e,a,r){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/").concat(t),method:"post",params:{pageNo:e,pageSize:a},data:r})}function l(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/queryAllChargeName"),method:"post",params:t})}function u(t,e,a,r,i){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/").concat(t),method:"post",params:{pageNo:e,pageSize:a,chargeModeName:r,type:i}})}function p(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/saveChargeMode"),method:"post",data:t})}function d(){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/api/getAllApi"),method:"post"})}function f(t,e){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/").concat(t),method:"post",params:{email:e}})}function m(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/delChargeMode/").concat(t),method:"delete"})}function g(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/updateChargeMode"),method:"post",data:t})}function b(t,e){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/update/").concat(t,"/").concat(e),method:"post"})}function h(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/chargeMode/delChargeMode"),method:"delete",data:t})}},"0a69":function(t,e,a){"use strict";a.d(e,"g",(function(){return i})),a.d(e,"b",(function(){return s})),a.d(e,"a",(function(){return c})),a.d(e,"c",(function(){return l})),a.d(e,"h",(function(){return u})),a.d(e,"d",(function(){return p})),a.d(e,"e",(function(){return d})),a.d(e,"f",(function(){return f}));a("99af");var o=a("b775"),r=a("e686"),n=a.n(r);function i(){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/api/getAllApi"),method:"post"})}function s(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/api/findByApiInfo/").concat(t),method:"get"})}function c(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/api/findApiFrequency"),method:"get",params:t})}function l(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/api/findCustomerFrequency"),method:"get",params:t})}function u(t){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/Inerface/interfaceAssociationScenarioByid/").concat(t),method:"get"})}function p(t,e){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/Inerface/findInterfaceCountByid"),method:"post",params:e,data:t})}function d(){return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/Inerface/findInterfaceRelationAll"),method:"post"})}function f(t){var e=t.pageNo,a=t.pageSize;return Object(o["a"])({url:"".concat(n.a.ProxyUrl,"/Inerface/findInterfaceRelationPage/page"),method:"post",params:{pageNo:e,pageSize:a}})}},2909:function(t,e,a){"use strict";function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,o=new Array(e);a<e;a++)o[a]=t[a];return o}function r(t){if(Array.isArray(t))return o(t)}a.d(e,"a",(function(){return c}));a("a4d3"),a("e01a"),a("d3b7"),a("d28b"),a("3ca3"),a("ddb0"),a("a630");function n(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}a("fb6a"),a("b0c0"),a("ac1f"),a("00b4");function i(t,e){if(t){if("string"===typeof t)return o(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?o(t,e):void 0}}function s(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t){return r(t)||n(t)||i(t)||s()}},"466d":function(t,e,a){"use strict";var o=a("d784"),r=a("825a"),n=a("50c4"),i=a("1d80"),s=a("8aa5"),c=a("14c3");o("match",1,(function(t,e,a){return[function(e){var a=i(this),o=void 0==e?void 0:e[t];return void 0!==o?o.call(e,a):new RegExp(e)[t](String(a))},function(t){var o=a(e,t,this);if(o.done)return o.value;var i=r(t),l=String(this);if(!i.global)return c(i,l);var u=i.unicode;i.lastIndex=0;var p,d=[],f=0;while(null!==(p=c(i,l))){var m=String(p[0]);d[f]=m,""===m&&(i.lastIndex=s(l,n(i.lastIndex),u)),f++}return 0===f?null:d}]}))},"4df4":function(t,e,a){"use strict";var o=a("0366"),r=a("7b0b"),n=a("9bdd"),i=a("e95a"),s=a("50c4"),c=a("8418"),l=a("35a1");t.exports=function(t){var e,a,u,p,d,f,m=r(t),g="function"==typeof this?this:Array,b=arguments.length,h=b>1?arguments[1]:void 0,v=void 0!==h,y=l(m),L=0;if(v&&(h=o(h,b>2?arguments[2]:void 0,2)),void 0==y||g==Array&&i(y))for(e=s(m.length),a=new g(e);e>L;L++)f=v?h(m[L],L):m[L],c(a,L,f);else for(p=y.call(m),d=p.next,a=new g;!(u=d.call(p)).done;L++)f=v?n(p,h,[u.value,L],!0):u.value,c(a,L,f);return a.length=L,a}},"4f6f":function(t,e,a){},7156:function(t,e,a){var o=a("861d"),r=a("d2bb");t.exports=function(t,e,a){var n,i;return r&&"function"==typeof(n=e.constructor)&&n!==a&&o(i=n.prototype)&&i!==a.prototype&&r(t,i),t}},a15b:function(t,e,a){"use strict";var o=a("23e7"),r=a("44ad"),n=a("fc6a"),i=a("a640"),s=[].join,c=r!=Object,l=i("join",",");o({target:"Array",proto:!0,forced:c||!l},{join:function(t){return s.call(n(this),void 0===t?",":t)}})},a434:function(t,e,a){"use strict";var o=a("23e7"),r=a("23cb"),n=a("a691"),i=a("50c4"),s=a("7b0b"),c=a("65f0"),l=a("8418"),u=a("1dde"),p=a("ae40"),d=u("splice"),f=p("splice",{ACCESSORS:!0,0:0,1:2}),m=Math.max,g=Math.min,b=9007199254740991,h="Maximum allowed length exceeded";o({target:"Array",proto:!0,forced:!d||!f},{splice:function(t,e){var a,o,u,p,d,f,v=s(this),y=i(v.length),L=r(t,y),x=arguments.length;if(0===x?a=o=0:1===x?(a=0,o=y-L):(a=x-2,o=g(m(n(e),0),y-L)),y+a-o>b)throw TypeError(h);for(u=c(v,o),p=0;p<o;p++)d=L+p,d in v&&l(u,p,v[d]);if(u.length=o,a<o){for(p=L;p<y-o;p++)d=p+o,f=p+a,d in v?v[f]=v[d]:delete v[f];for(p=y;p>y-o+a;p--)delete v[p-1]}else if(a>o)for(p=y-o;p>L;p--)d=p+o-1,f=p+a-1,d in v?v[f]=v[d]:delete v[f];for(p=0;p<a;p++)v[p+L]=arguments[p+2];return v.length=y-o+a,u}})},a630:function(t,e,a){var o=a("23e7"),r=a("4df4"),n=a("1c7e"),i=!n((function(t){Array.from(t)}));o({target:"Array",stat:!0,forced:i},{from:r})},a9e3:function(t,e,a){"use strict";var o=a("83ab"),r=a("da84"),n=a("94ca"),i=a("6eeb"),s=a("5135"),c=a("c6b6"),l=a("7156"),u=a("c04e"),p=a("d039"),d=a("7c73"),f=a("241c").f,m=a("06cf").f,g=a("9bf2").f,b=a("58a8").trim,h="Number",v=r[h],y=v.prototype,L=c(d(y))==h,x=function(t){var e,a,o,r,n,i,s,c,l=u(t,!1);if("string"==typeof l&&l.length>2)if(l=b(l),e=l.charCodeAt(0),43===e||45===e){if(a=l.charCodeAt(2),88===a||120===a)return NaN}else if(48===e){switch(l.charCodeAt(1)){case 66:case 98:o=2,r=49;break;case 79:case 111:o=8,r=55;break;default:return+l}for(n=l.slice(2),i=n.length,s=0;s<i;s++)if(c=n.charCodeAt(s),c<48||c>r)return NaN;return parseInt(n,o)}return+l};if(n(h,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var O,I=function(t){var e=arguments.length<1?0:t,a=this;return a instanceof I&&(L?p((function(){y.valueOf.call(a)})):c(a)!=h)?l(new v(x(e)),a,I):x(e)},S=o?f(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;S.length>w;w++)s(v,O=S[w])&&!s(I,O)&&g(I,O,m(v,O));I.prototype=y,y.constructor=I,i(r,h,I)}},a9eb:function(t,e,a){"use strict";a("4f6f")},d0be:function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-row",[a("el-col",{attrs:{span:24}},[a("el-tabs",{model:{value:t.activeLabel,callback:function(e){t.activeLabel=e},expression:"activeLabel"}},t._l(t.tabOption,(function(t){return a("el-tab-pane",{key:t.value,attrs:{label:t.value>1?t.label+(Number(t.value)-1):t.label,name:t.value}})})),1)],1)],1),a("el-card",{directives:[{name:"show",rawName:"v-show",value:"1"===t.activeLabel,expression:"activeLabel==='1'"}],staticClass:"box-card",attrs:{shadow:"never"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("基础信息")])]),a("el-form",{ref:"customer",staticClass:"demo-customer",attrs:{size:"mini",model:t.customer,"label-width":"120px"}},[a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:" 客户名称",prop:"name",rules:{required:!0,message:"不能为空",trigger:"blur"}}},[a("el-input",{attrs:{disabled:t.isOld},model:{value:t.customer.name,callback:function(e){t.$set(t.customer,"name","string"===typeof e?e.trim():e)},expression:"customer.name"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"客户简称",prop:"abbreviation",rules:{required:!0,message:"不能为空",trigger:"blur"}}},[a("el-input",{attrs:{disabled:t.isOld},model:{value:t.customer.abbreviation,callback:function(e){t.$set(t.customer,"abbreviation","string"===typeof e?e.trim():e)},expression:"customer.abbreviation"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:" UserKey",prop:"userKey",rules:{required:!0,message:"不能为空",trigger:"blur"}}},[a("el-input",{attrs:{disabled:t.isOld},model:{value:t.customer.userKey,callback:function(e){t.$set(t.customer,"userKey","string"===typeof e?e.trim():e)},expression:"customer.userKey"}})],1)],1)],1),t._l(t.customer.contactList,(function(e,o){return a("el-row",{key:e.key},[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"联系人"+(0!==o?o:""),prop:"contactList."+o+".contacts",rules:{required:!0,message:"联系人不能为空",trigger:"blur"}}},[a("div",{staticStyle:{display:"flex"}},[a("el-input",{model:{value:e.contacts,callback:function(a){t.$set(e,"contacts","string"===typeof a?a.trim():a)},expression:"contactList.contacts"}}),o?a("el-button",{staticClass:"el-icon-remove-outline",staticStyle:{padding:"5px"},attrs:{type:"text"},on:{click:function(a){return a.preventDefault(),t.removeDomain(e)}}}):t._e(),0===o?a("el-button",{staticClass:"el-icon-circle-plus-outline",staticStyle:{padding:"5px"},attrs:{type:"text"},on:{click:function(e){return e.preventDefault(),t.addDomain()}}}):t._e()],1)])],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"联系电话"+(0!==o?o:""),prop:"contactList."+o+".contactsNumber",rules:{validator:t.validatePhone,trigger:"blur"}}},[a("el-input",{attrs:{placeholder:"可输入多个手机号，用','隔开"},model:{value:e.contactsNumber,callback:function(a){t.$set(e,"contactsNumber","string"===typeof a?a.trim():a)},expression:"contactList.contactsNumber"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"联系邮箱"+(0!==o?o:""),prop:"contactList."+o+".email",rules:{validator:t.validateEmail,trigger:"blur"}}},[a("el-input",{attrs:{placeholder:"可输入多个邮箱，用','隔开"},model:{value:e.email,callback:function(a){t.$set(e,"email","string"===typeof a?a.trim():a)},expression:"contactList.email"}})],1)],1)],1)}))],2)],1),t._l(t.cooperationLists,(function(e,o){return a("div",{key:e.key},[a("div",{directives:[{name:"show",rawName:"v-show",value:t.activeLabel===String(o+2),expression:"activeLabel===String(index+2)"}]},[a("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("合作信息"+t._s(o+1))]),!o||e.isOld||e.isRenewal?t._e():a("span",{staticStyle:{"margin-left":"5px"}},[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(e){return t.removeCooperationList(o)}}},[t._v("删除合同")])],1)]),a("el-form",{ref:"cooperationList",refInFor:!0,staticClass:"demo-cooperationList",attrs:{model:e,rules:t.cooperationRules,"label-width":"120px",size:"mini"}},[a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"合作方式"}},[a("el-select",{attrs:{placeholder:"请选择",disabled:e.isOld},model:{value:e.cooperationMod,callback:function(a){t.$set(e,"cooperationMod",a)},expression:"cooperationList.cooperationMod"}},[a("el-option",{attrs:{label:"外采服务",value:"外采服务"}}),a("el-option",{attrs:{label:"联合",value:"联合"}})],1)],1)],1),a("el-col",{attrs:{span:8,offset:2}},[a("el-form-item",{attrs:{label:"合同编号",prop:"cooperationNumber"}},[a("el-input",{attrs:{placeholder:"请输入",disabled:e.isOld},model:{value:e.cooperationNumber,callback:function(a){t.$set(e,"cooperationNumber","string"===typeof a?a.trim():a)},expression:"cooperationList.cooperationNumber"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"合同生效日期",prop:"startTime"}},[a("el-date-picker",{attrs:{disabled:e.isOld,type:"datetime",placeholder:"选择日期","value-format":"yyyy-MM-dd HH:mm:ss"},on:{change:function(a){return t.cooperationTermChange(e.startTime,o)}},model:{value:e.startTime,callback:function(a){t.$set(e,"startTime",a)},expression:"cooperationList.startTime"}})],1)],1),a("el-col",{attrs:{span:6,offset:2}},[e.isOld?a("el-form-item",{attrs:{label:"合同期限",prop:"cooperationTerm"}},[a("el-input",{attrs:{placeholder:e.cooperationTerm/12+"年",disabled:e.isOld}})],1):a("el-form-item",{attrs:{label:e.isRenewal?"续期":"合同期限",prop:"cooperationTerm"}},[a("el-select",{attrs:{placeholder:"请选择",disabled:e.isOld},model:{value:e.cooperationTerm,callback:function(a){t.$set(e,"cooperationTerm",a)},expression:"cooperationList.cooperationTerm"}},[a("el-option",{attrs:{label:"半年",value:6}}),a("el-option",{attrs:{label:"1年",value:12}}),a("el-option",{attrs:{label:"2年",value:24}}),a("el-option",{attrs:{label:"3年",value:36}})],1)],1)],1),e.isOld?a("el-col",{attrs:{span:2}},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.renewal(o)}}},[t._v("续期")])],1):t._e(),a("el-col",{attrs:{span:6,offset:e.isOld?0:2}},[a("el-form-item",{attrs:{label:"合同状态"}},[a("el-input",{attrs:{disabled:"",placeholder:"请选择"},model:{value:e.cooperationState,callback:function(a){t.$set(e,"cooperationState",a)},expression:"cooperationList.cooperationState"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"结算周期",prop:"settleAccountsCycle"}},[a("el-select",{attrs:{placeholder:"请选择",disabled:e.isOld},on:{change:function(e){return t.settleAccountsCycleChange(o)}},model:{value:e.settleAccountsCycle,callback:function(a){t.$set(e,"settleAccountsCycle",a)},expression:"cooperationList.settleAccountsCycle"}},[a("el-option",{attrs:{label:"月结",value:"月结"}}),a("el-option",{attrs:{label:"季结",value:"季结"}}),a("el-option",{attrs:{label:"年结",value:"年结"}})],1)],1)],1),a("el-col",{attrs:{span:6,offset:2}},[a("el-form-item",{attrs:{label:"结算日期",prop:"settleAccountsDay"}},[a("el-input",{attrs:{placeholder:"请输入",disabled:e.isOld},model:{value:e.settleAccountsDay,callback:function(a){t.$set(e,"settleAccountsDay","string"===typeof a?a.trim():a)},expression:"cooperationList.settleAccountsDay"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"计费模式",prop:"chargingMod"}},[a("el-select",{attrs:{placeholder:"请选择",disabled:e.isOld},on:{change:function(a){return t.charginModChange(o,e.chargingMod)}},model:{value:e.chargingMod,callback:function(a){t.$set(e,"chargingMod",a)},expression:"cooperationList.chargingMod"}},t._l(t.chargingModOption,(function(t,e){return a("el-option",{key:e,attrs:{label:t.chargeName,value:t.chargeName}})})),1)],1)],1),e.chargingMod?a("div",[a("el-col",{attrs:{span:6,offset:2}},[a("el-form-item",{attrs:{label:"计费描述"}},[a("el-input",{attrs:{placeholder:"请输入",disabled:""},model:{value:e.agreement,callback:function(a){t.$set(e,"agreement","string"===typeof a?a.trim():a)},expression:"cooperationList.agreement"}})],1)],1),a("el-col",{attrs:{span:6,offset:2}},[a("el-form-item",{attrs:{label:"费用标准",prop:"chargingStandard"}},[a("el-row",{staticStyle:{display:"flex"}},[a("el-input",{staticStyle:{flex:"2"},attrs:{type:"number",min:"0",disabled:e.isOld,oninput:"if(value == null || value<0)value=0"},on:{input:function(e){return t.limitInput(t.cooperationLists,o)}},model:{value:e.chargingStandard,callback:function(a){t.$set(e,"chargingStandard","string"===typeof a?a.trim():a)},expression:"cooperationList.chargingStandard"}}),a("div",{staticStyle:{flex:"1"}},[t._v(t._s(e.chargingModPostfix))])],1)],1)],1)],1):t._e()],1)],1)],1),t._l(e.apiInfoLists,(function(r,n){return a("div",{key:r.key},[a("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("服务信息"+t._s(0!==n?n:""))]),a("span",{staticStyle:{"margin-left":"5px"}},[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(e){return t.addApiInfoList(o)}}},[t._v("新增服务")])],1),!n||r.isOld||e.isRenewal?t._e():a("span",{staticStyle:{"margin-left":"5px"}},[a("el-button",{attrs:{type:"text",size:"mini"},on:{click:function(e){return t.removeApiInfoList(o,n)}}},[t._v("删除服务")])],1)]),a("el-form",{ref:"apiInfoList",refInFor:!0,staticClass:"demo-apiInfoList",attrs:{model:r,rules:t.apiInfoListsRules,"label-width":"120px",size:"mini"}},[a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"API名称",prop:"apiName"}},[a("el-select",{attrs:{disabled:r.isOld,placeholder:"请选择"},on:{change:function(e){return t.apiChange(o,n,r.apiName)}},model:{value:r.apiName,callback:function(e){t.$set(r,"apiName",e)},expression:"apiInfoList.apiName"}},t._l(t.options,(function(t){return a("el-option",{key:t.id,attrs:{label:t.apiName,value:t.apiName}})})),1)],1)],1),a("el-col",{attrs:{span:8,offset:2}},[a("el-form-item",{attrs:{label:"服务具体内容",prop:"note"}},[a("el-input",{attrs:{disabled:r.isOld},model:{value:r.note,callback:function(e){t.$set(r,"note","string"===typeof e?e.trim():e)},expression:"apiInfoList.note"}})],1)],1)],1),a("el-row",[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"登录账号",prop:"account"}},[a("el-input",{attrs:{disabled:r.isOld},model:{value:r.account,callback:function(e){t.$set(r,"account","string"===typeof e?e.trim():e)},expression:"apiInfoList.account"}})],1)],1),a("el-col",{attrs:{span:6,offset:2}},[a("el-form-item",{attrs:{label:"邮箱",prop:"email"}},[a("el-input",{attrs:{disabled:r.isOld},model:{value:r.email,callback:function(e){t.$set(r,"email","string"===typeof e?e.trim():e)},expression:"apiInfoList.email"}})],1)],1),a("el-col",{attrs:{span:6,offset:2}},[a("el-form-item",{attrs:{label:"登录密钥",prop:"password"}},[a("el-input",{attrs:{type:"password",disabled:r.isOld},model:{value:r.password,callback:function(e){t.$set(r,"password","string"===typeof e?e.trim():e)},expression:"apiInfoList.password"}})],1)],1),r.isOld?t._e():a("el-col",{staticStyle:{"margin-left":"5px"},attrs:{span:1}},[a("el-tooltip",{attrs:{content:"点击自动生成密钥",placement:"bottom",effect:"light"}},[a("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-key",circle:""},on:{click:function(e){return t.generateKey(o,n)}}})],1)],1)],1)],1)],1)],1)}))],2)])})),a("div",{staticStyle:{"margin-top":"10px"}},[a("el-button",{on:{click:t.addCooperationList}},[t._v("新增合同")]),a("el-button",{on:{click:function(e){return t.submitForm()}}},[t._v("提交")])],1)],2)},r=[],n=a("5530"),i=a("2909"),s=a("1da1"),c=(a("96cf"),a("ac1f"),a("1276"),a("466d"),a("a15b"),a("d3b7"),a("159b"),a("a434"),a("d81d"),a("4de4"),a("e9c4"),a("a9e3"),a("00b4"),a("f6b0")),l=a("0a69"),u=a("04ca"),p={props:{isOld:{type:Boolean,default:!0},cooperation:{type:Array,default:function(){return[{agreement:"",chargingMod:"",chargingStandard:"",settleAccountsCycle:"",settleAccountsDay:"",cooperationMod:"",cooperationNumber:"",cooperationState:"",cooperationTerm:"",startTime:"",apiInfoLists:[{account:"",cooperationNum:"",cooperationTerm:"",cooperationState:"",chargingMod:"",password:"",belongScene:"",email:"",apiId:"",note:""}]}]}},customer:{type:Object,default:function(){return{abbreviation:"",userKey:"",name:"",contactList:[{contacts:"",contactsNumber:"",email:""}]}}}},data:function(){return{activeLabel:"1",tabOption:[{label:"基础信息",value:"1"}],isRenewal:!1,apiAccountList:[{account:"string",apiAddress:"string",apiName:"string",belongScene:"string",email:"string",password:"string"}],cooperationLists:{},delectContactList:[],options:[],chargingModOption:[],chargingModPostfix:"",copyCooperationLists:[],cooperationRules:{cooperationNumber:[{required:!0,message:"不能为空",trigger:"blur"},{max:20,message:"最长为20个字符",trigger:"blur"}],startTime:[{required:!0,message:"不能为空"}],settleAccountsCycle:[{required:!0,message:"不能为空"},{max:255,message:"最长为255个字符",trigger:"blur"}],settleAccountsDay:[{required:!0,message:"不能为空",trigger:"change"},{max:255,message:"最长为255个字符",trigger:"blur"}],cooperationTerm:[{required:!0,message:"不能为空",trigger:"change"}],chargingMod:[{required:!0,message:"不能为空"}],chargingStandard:[{required:!0,message:"不能为空或输入格式不正确",trigger:"blur"}]},apiInfoLists:[{account:"",cooperationNum:"",cooperationTerm:"",cooperationState:"",chargingMod:"",password:"",belongScene:"",email:"",apiId:"",note:""}],apiInfoListsRules:{account:[{required:!0,message:"不能为空",trigger:"blur"}],password:[{required:!0,message:"不能为空",trigger:"blur"}],email:[{required:!0,validator:this.validateEmail,trigger:"blur"}],apiName:[{required:!0,message:"不能为空"}]}}},created:function(){this.init()},methods:{limitInput:function(t,e){if(""!==t[e].chargingStandard)if(0!==t[e].chargingStandard.indexOf(".")){var a=t[e].chargingStandard.split("");this.cooperationLists[e].chargingStandard=a.join("").match(/^\d+(\.\d{1,2})?/g)[0]||null}else this.cooperationLists[e].chargingStandard=0},generateKey:function(t,e){var a=this;Object(c["f"])().then((function(o){a.cooperationLists[t].apiInfoLists[e].password=o}))},init:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.copyCooperationLists=t.deepCopy(t.cooperation),e.next=3,Object(u["k"])({type:"客户"});case 3:return t.chargingModOption=e.sent,e.next=6,Object(l["g"])();case 6:t.options=e.sent,t.isOld?(t.cooperationLists=t.deepCopy(t.cooperation),t.cooperationLists.forEach((function(e,a){t.charginModChange(a,e.chargingMod)}))):t.cooperationLists=t.deepCopy(t.copyCooperationLists);case 8:case"end":return e.stop()}}),e)})))()},removeDomain:function(t){var e=this,a=this.customer.contactList.indexOf(t);-1!==a&&(this.customer.contactList[a].contacts||this.customer.contactList[a].contactsNumber||this.customer.contactList[a].email?this.$confirm("是否删除联系人","确认信息",{distinguishCancelAndClose:!0,confirmButtonText:"删除",cancelButtonText:"放弃删除",lockScroll:!1}).then((function(){e.customerInfo.contact[a].isOld&&e.delectContactList.push(e.customerInfo.contact[a].contactId),e.customer.contactList.splice(a,1)})).catch((function(){})):this.customer.contactList.splice(a,1))},addDomain:function(){this.customer.contactList.push({contacts:"",contactsNumber:"",email:"",key:Date.now()})},submitForm:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var a,o,r,n,s,l,u;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:a=!0,console.log(t.$refs.customer),t.$refs.customer.validate((function(e){e||(t.activeLabel="1",a=!1)})),o=[],t.cooperationLists.map((function(e,r){e.apiInfoLists.map((function(t){t.index=r})),o.push.apply(o,Object(i["a"])(e.apiInfoLists)),t.$refs.cooperationList[r].validate((function(e){e||(a&&(t.activeLabel=String(r+2)),a=!1)}))})),t.apiInfoLists=o,t.apiInfoLists.map((function(e,o){e.isOld||t.$refs.apiInfoList[o].validate((function(o){o||(a&&(t.activeLabel=String(e.index+2)),a=!1)}))})),a?(r=t.deepCopy(t.customer),n=t.deepCopy(t.cooperationLists),s=[],l=Object(i["a"])(t.customer.contactList),u=[],n.map((function(t,e){t.key&&delete t.key,t.apiInfoLists.map((function(e,a){e.isOld||(e.cooperationNum=t.cooperationNumber,e.chargingMod=t.chargingMod,e.cooperationState=t.cooperationState,e.cooperationTerm=t.cooperationTerm,s.push(t.apiInfoLists[a]),e.key&&delete e.key)})),delete t.apiInfoLists})),n=n.filter((function(t){return!t.isOld})),delete r.contactList,s.map((function(t,e){var a={};a.account=t.account,a.apiAddress=t.apiAddress,a.apiId=t.apiId,a.apiName=t.apiName,a.belongScene=t.belongScene,a.email=t.email,a.password=t.password,u.push(a),delete t.apiAddress,delete t.apiName,delete t.belongScene})),t.delectContactList.length&&t.delectContactList.map((function(e){Object(c["b"])(e).then().catch((function(){t.$message.error("联系人删除错误")}))})),t.$emit("submit",{apiAccountList:u,apiAssociativeInfoList:s,contact:l,cooperationList:n,customer:r},t.isRenewal)):t.$message.error("表单未完成,无法提交");case 8:case"end":return e.stop()}}),e)})))()},renewal:function(t){this.cooperationLists.forEach((function(e,a){a===t&&(e.cooperationTerm=12,e.isOld=!1,e.apiInfoLists.forEach((function(t){t.isOld=!1})))})),this.cooperationLists[t].isRenewal=!0,this.isRenewal=!0,this.cooperationLists=Object(i["a"])(this.cooperationLists)},apiChange:function(t,e,a){var o=this.options.filter((function(t){return t.apiName===a}));this.cooperationLists[t].apiInfoLists[e].note=o[0].apiMsg,this.cooperationLists[t].apiInfoLists[e].apiId=o[0].id,this.cooperationLists[t].apiInfoLists[e].apiAddress=o[0].apiAddress,this.cooperationLists[t].apiInfoLists[e].apiName=o[0].apiName,this.cooperationLists[t].apiInfoLists[e].belongScene=o[0].serviceType},charginModChange:function(t,e){var a=this;this.chargingModOption.map((function(o){o.chargeName===e&&(a.cooperationLists[t].agreement=o.chargeDescribe,1===o.type&&(a.cooperationLists[t].chargingModPostfix="次/年"),2===o.type&&(a.cooperationLists[t].chargingModPostfix="/无限制"),3===o.type&&(a.cooperationLists[t].chargingModPostfix="元/标签"),o.type||(a.cooperationLists[t].chargingModPostfix=""))}))},cooperationTermChange:function(t,e){this.cooperationLists[e].cooperationState=new Date(t)>new Date?"未生效":"正常"},settleAccountsCycleChange:function(t){var e=this.cooperationLists[t].settleAccountsCycle;"月结"===e&&(this.cooperationLists[t].settleAccountsDay="次月5号"),"季结"===e&&(this.cooperationLists[t].settleAccountsDay="次季首月5号"),"年结"===e&&(this.cooperationLists[t].settleAccountsDay="自然年次年首月5号")},deepCopy:function(t){return JSON.parse(JSON.stringify(t))},resetForm:function(t){this.$refs[t].resetFields()},removeApiInfoList:function(t,e){this.cooperationLists[t].apiInfoLists.splice(e,1)},removeCooperationList:function(t){this.cooperationLists.splice(t,1),this.tabOption.splice(t+1,1),this.tabOption.map((function(e,a){a>t&&(e.value=String(Number(e.value)-1))})),Number(this.activeLabel)>this.tabOption.length&&(this.activeLabel=String(Number(this.activeLabel)-1))},addCooperationList:function(){this.tabOption.push({label:"合作信息",value:String(this.tabOption.length+1)}),this.activeLabel=String(this.tabOption.length),this.cooperationLists.push(Object(n["a"])(Object(n["a"])({},this.copyCooperationLists[0]),{},{apiInfoLists:this.deepCopy(this.apiInfoLists),key:Date.now()}))},addApiInfoList:function(t){this.cooperationLists[t].apiInfoLists.push(Object(n["a"])(Object(n["a"])({},this.apiInfoLists[0]),{},{key:Date.now()}))},validatePhone:function(t,e,a){""===e&&a(new Error("至少输入一个手机号"));for(var o=e.split(/,|，/),r=0;r<o.length;r++){/^1[3-9]\d{9}$/.test(o[r])?a():a(new Error("输入格式有误"));for(var n=r+1;n<o.length;n++)o[r]===o[n]?a(new Error("请勿输入相同的手机号")):a()}},validateEmail:function(t,e,a){""===e&&a(new Error("至少输入一个邮箱地址"));for(var o=e.split(/,|，/),r=0;r<o.length;r++){/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(o[r])?a():a(new Error("输入格式有误"));for(var n=r+1;n<o.length;n++)o[r]===o[n]?a(new Error("请勿输入相同的邮箱地址")):a()}}}},d=p,f=(a("a9eb"),a("2877")),m=Object(f["a"])(d,o,r,!1,null,"fa522384",null);e["a"]=m.exports},d28b:function(t,e,a){var o=a("746f");o("iterator")},e01a:function(t,e,a){"use strict";var o=a("23e7"),r=a("83ab"),n=a("da84"),i=a("5135"),s=a("861d"),c=a("9bf2").f,l=a("e893"),u=n.Symbol;if(r&&"function"==typeof u&&(!("description"in u.prototype)||void 0!==u().description)){var p={},d=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),e=this instanceof d?new u(t):void 0===t?u():u(t);return""===t&&(p[e]=!0),e};l(d,u);var f=d.prototype=u.prototype;f.constructor=d;var m=f.toString,g="Symbol(test)"==String(u("test")),b=/^Symbol\((.*)\)[^)]+$/;c(f,"description",{configurable:!0,get:function(){var t=s(this)?this.valueOf():this,e=m.call(t);if(i(p,t))return"";var a=g?e.slice(7,-1):e.replace(b,"$1");return""===a?void 0:a}}),o({global:!0,forced:!0},{Symbol:d})}},fb6a:function(t,e,a){"use strict";var o=a("23e7"),r=a("861d"),n=a("e8b5"),i=a("23cb"),s=a("50c4"),c=a("fc6a"),l=a("8418"),u=a("b622"),p=a("1dde"),d=a("ae40"),f=p("slice"),m=d("slice",{ACCESSORS:!0,0:0,1:2}),g=u("species"),b=[].slice,h=Math.max;o({target:"Array",proto:!0,forced:!f||!m},{slice:function(t,e){var a,o,u,p=c(this),d=s(p.length),f=i(t,d),m=i(void 0===e?d:e,d);if(n(p)&&(a=p.constructor,"function"!=typeof a||a!==Array&&!n(a.prototype)?r(a)&&(a=a[g],null===a&&(a=void 0)):a=void 0,a===Array||void 0===a))return b.call(p,f,m);for(o=new(void 0===a?Array:a)(h(m-f,0)),u=0;f<m;f++,u++)f in p&&l(o,u,p[f]);return o.length=u,o}})}}]);