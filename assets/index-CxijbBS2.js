import{r as y,d as re,w as H,a as p,b as ie,c as m,o as g,e as s,f as r,g as o,n as ce,u as l,m as ue,h as k,t as T,s as de,i as pe,j as z,k as C,l as fe,T as L,p as _e,q as B,v as K,x as me,y as ge,z as he,A as ve,F as ye,B as xe,E as Te,C as Se,D as we}from"./vendor-CreGFccz.js";(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const d of e.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function c(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(n){if(n.ep)return;n.ep=!0;const e=c(n);fetch(n.href,e)}})();function be(){const i=y(!1),u=y(""),c=y("");let a=null;const n=()=>"webkitSpeechRecognition"in window?(a=new window.webkitSpeechRecognition,a.continuous=!0,a.interimResults=!0,a.lang="en-US",a.onresult=h=>{let S="",v="";for(let w=h.resultIndex;w<h.results.length;++w)h.results[w].isFinal?S+=h.results[w][0].transcript:v+=h.results[w][0].transcript;v&&(c.value=v),S&&(u.value+=(u.value?" ":"")+S,c.value="")},a.onerror=h=>{console.error("语音识别错误:",h.error),d()},!0):(alert("您的浏览器不支持语音识别功能"),!1),e=()=>{!a&&!n()||(u.value="",c.value="",a==null||a.start(),i.value=!0)},d=()=>{a==null||a.stop(),i.value=!1,c.value=""};return{isRecording:i,currentText:u,interimText:c,startRecording:e,stopRecording:d}}const Re="809CUhDmYkjZDyN3k5XXNm437krKM5K2dLsrkDQ8plUvkErtrKYNJQQJ99BBACULyCpXJ3w3AAAbACOGZfRu",ke="global";function Ce(i){return i?i.replace(/\./g,"。").replace(/,/g,"，").replace(/\?/g,"？").replace(/!/g,"！").replace(/:/g,"：").replace(/;/g,"；").replace(/\(/g,"（").replace(/\)/g,"）").replace(/"/g,"“").replace(/'/g,"‘").replace(/\s+/g," ").trim().replace(/([。！？])\s*/g,`$1
`).replace(/\n+/g,`
`).trim():""}function M(){const i=y(""),u=y(!1);return{translatedText:i,isTranslating:u,translate:async a=>{var n,e;if(!a.trim())return"";u.value=!0;try{const d=await fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans",{method:"POST",headers:{"Ocp-Apim-Subscription-Key":Re,"Ocp-Apim-Subscription-Region":ke,"Content-Type":"application/json"},body:JSON.stringify([{text:a}])});if(!d.ok)throw new Error("翻译请求失败");const S=((e=(n=(await d.json())[0])==null?void 0:n.translations[0])==null?void 0:e.text)||"",v=Ce(S);return i.value=v,v}catch(d){return console.error("翻译错误:",d),"翻译失败，请重试"}finally{u.value=!1}}}}const U="translation_history",J=50;function Oe(){const i=y([]),u=()=>{try{const e=localStorage.getItem(U);e&&(i.value=JSON.parse(e))}catch(e){console.error("加载历史记录失败:",e)}},c=()=>{try{localStorage.setItem(U,JSON.stringify(i.value))}catch(e){console.error("保存历史记录失败:",e)}},a=(e,d)=>{!e.trim()||!d.trim()||(i.value.unshift({original:e,translated:d,timestamp:Date.now()}),i.value.length>J&&(i.value=i.value.slice(0,J)),c())},n=()=>{i.value=[],c()};return u(),{history:i,addRecord:a,clearHistory:n}}const Ne={class:"app-container"},ze={class:"header-content"},Ae={class:"controls"},Ve={class:"text-panel original-text"},Ee={class:"panel-header"},Ie={class:"text-content"},De={key:0,class:"text"},He={key:0,class:"interim"},Le={key:1,class:"placeholder"},Be={class:"text-panel translated-text"},Ke={class:"panel-header"},Me={class:"text-content"},Ue={key:0,class:"text"},Je={key:1,class:"placeholder"},Pe={class:"manual-section"},Fe={class:"manual-input-container"},Ge={class:"manual-header"},Ye={class:"manual-content"},je={class:"manual-result-container"},Xe={class:"panel-header"},Qe={class:"manual-result-content"},qe={class:"text"},Ze={class:"history-container"},$e={class:"history-header"},We={class:"history-item-header"},et={class:"timestamp"},tt={class:"original"},st={class:"translated"},nt={class:"settings-content"},ot=re({__name:"App",setup(i){const u=y(!1),c=y(16),a=localStorage.getItem("fontSize");a&&(c.value=parseInt(a)),H(c,f=>{localStorage.setItem("fontSize",f.toString())});const{isRecording:n,currentText:e,interimText:d,startRecording:h,stopRecording:S}=be(),{translatedText:v,isTranslating:w,translate:A}=M(),{history:F,addRecord:V,clearHistory:G}=Oe();H([e,d],async([f,t])=>{if(f.trim()){const x=await A(f);x&&x!=="翻译失败，请重试"&&V(f,x)}else t.trim()&&await A(t)});const Y=()=>{n.value?S():h()},j=()=>{Te.confirm("确定要清空所有历史记录吗？此操作不可恢复。","警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{G()}).catch(()=>{})},X=f=>new Date(f).toLocaleString("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),{translatedText:E,isTranslating:I,translate:Q}=M(),b=y(""),D=async()=>{if(!b.value.trim())return;const f=await Q(b.value);f&&f!=="翻译失败，请重试"&&(V(b.value,f),b.value="")};return(f,t)=>{const x=p("el-button"),q=p("el-header"),R=p("el-icon"),O=p("el-scrollbar"),Z=p("el-input"),$=p("el-main"),W=p("el-footer"),ee=p("el-container"),te=p("el-slider"),se=p("el-form-item"),ne=p("el-form"),oe=p("el-dialog"),ae=p("el-config-provider"),N=ie("loading");return g(),m("div",Ne,[s(ae,null,{default:r(()=>[s(ee,{class:"main-container"},{default:r(()=>[s(q,{height:"80px"},{default:r(()=>[o("div",ze,[t[6]||(t[6]=o("h1",{class:"app-title"},"实时翻译助手",-1)),o("div",Ae,[s(x,{type:"primary",icon:l(ue),onClick:Y,class:ce([{recording:l(n)},"control-button"]),size:"large"},{default:r(()=>[k(T(l(n)?"停止录音":"开始录音"),1)]),_:1},8,["icon","class"]),s(x,{type:"info",icon:l(de),onClick:t[0]||(t[0]=_=>u.value=!0),size:"large",class:"control-button"},{default:r(()=>t[4]||(t[4]=[k(" 设置 ")])),_:1},8,["icon"]),s(x,{type:"danger",icon:l(pe),onClick:j,size:"large",class:"control-button"},{default:r(()=>t[5]||(t[5]=[k(" 清空历史 ")])),_:1},8,["icon"])])])]),_:1}),s($,null,{default:r(()=>[o("div",{class:"translation-container",style:z({fontSize:c.value+"px"})},[o("div",Ve,[o("div",Ee,[s(R,null,{default:r(()=>[s(l(fe))]),_:1}),t[7]||(t[7]=o("h3",null,"语音原文",-1))]),C((g(),m("div",Ie,[s(O,{height:"100%"},{default:r(()=>[s(L,{name:"fade"},{default:r(()=>[l(e)||l(d)?(g(),m("div",De,[o("p",null,T(l(e)),1),l(d)?(g(),m("p",He,T(l(d)),1)):_e("",!0)])):(g(),m("p",Le,"等待语音输入..."))]),_:1})]),_:1})])),[[N,l(n)]])]),o("div",Be,[o("div",Ke,[s(R,null,{default:r(()=>[s(l(B))]),_:1}),t[8]||(t[8]=o("h3",null,"语音译文",-1))]),C((g(),m("div",Me,[s(O,{height:"100%"},{default:r(()=>[s(L,{name:"fade"},{default:r(()=>[l(v)?(g(),m("p",Ue,T(l(v)),1)):(g(),m("p",Je,"等待翻译..."))]),_:1})]),_:1})])),[[N,l(w)]])])],4),o("div",Pe,[o("div",Fe,[o("div",Ge,[s(R,null,{default:r(()=>[s(l(K))]),_:1}),t[9]||(t[9]=o("h3",null,"手动输入翻译",-1))]),o("div",Ye,[s(Z,{modelValue:b.value,"onUpdate:modelValue":t[1]||(t[1]=_=>b.value=_),placeholder:"输入需要翻译的英文内容","suffix-icon":l(K),clearable:"",onKeyup:me(D,["enter"])},{append:r(()=>[s(x,{type:"primary",onClick:D,loading:l(I)},{default:r(()=>t[10]||(t[10]=[k(" 翻译 ")])),_:1},8,["loading"])]),_:1},8,["modelValue","suffix-icon"])])]),C(o("div",je,[o("div",Xe,[s(R,null,{default:r(()=>[s(l(B))]),_:1}),t[11]||(t[11]=o("h3",null,"翻译结果",-1))]),C((g(),m("div",Qe,[o("p",qe,T(l(E)),1)])),[[N,l(I)]])],512),[[ge,l(E)]])])]),_:1}),s(W,{height:"auto"},{default:r(()=>[o("div",Ze,[o("div",$e,[s(R,null,{default:r(()=>[s(l(he))]),_:1}),t[12]||(t[12]=o("h3",null,"历史记录",-1))]),s(O,{height:"150px"},{default:r(()=>[s(ve,{name:"list",tag:"div",class:"history-list"},{default:r(()=>[(g(!0),m(ye,null,xe(l(F),(_,le)=>(g(),m("div",{key:_.timestamp,class:"history-item",style:z({animationDelay:le*.1+"s"})},[o("div",We,[o("span",et,T(X(_.timestamp)),1)]),o("p",tt,T(_.original),1),o("p",st,T(_.translated),1)],4))),128))]),_:1})]),_:1})])]),_:1})]),_:1}),s(oe,{modelValue:u.value,"onUpdate:modelValue":t[3]||(t[3]=_=>u.value=_),title:"设置",width:"400px","align-center":""},{default:r(()=>[o("div",nt,[s(ne,{"label-position":"top"},{default:r(()=>[s(se,{label:"字体大小"},{default:r(()=>[o("div",{class:"font-size-preview",style:z({fontSize:c.value+"px"})}," 预览文本大小 ",4),s(te,{modelValue:c.value,"onUpdate:modelValue":t[2]||(t[2]=_=>c.value=_),min:12,max:32,step:2,"show-input":""},null,8,["modelValue"])]),_:1})]),_:1})])]),_:1},8,["modelValue"])]),_:1})])}}}),at=(i,u)=>{const c=i.__vccOpts||i;for(const[a,n]of u)c[a]=n;return c},lt=at(ot,[["__scopeId","data-v-ab595644"]]),P=Se(lt);P.use(we);P.mount("#app");
//# sourceMappingURL=index-CxijbBS2.js.map
