"use strict";
const IPs = {
  "20.205.243.166": "新加坡",
  "20.27.177.113": "日本",
  "20.200.245.247": "韩国",
  "20.207.73.82": "印度"
}
Object.keys(IPs).forEach(async ip => {
  let a=document.createElement("a");
  a.innerHTML = `<a>${IPs[ip]} 检测中</a>`;
  document.body.appendChild(a);
  document.body.appendChild(document.createElement("br"));
  const isOK = await testUrl(`https://${ip}/`);
  a.innerText = `${IPs[ip]} ${isOK?"可用":"不可用"}`;
  if(isOK){
    a.setAttribute("href",`https://${ip}/`);
  }
});
function testUrl(url) {
  let iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  let p = new Promise((resolve) => {
    let token = setTimeout(()=>{
      iframe.onerror = iframe.onload = null;
      resolve(false);
    },2000,false);
    iframe.onerror = () => {
      clearTimeout(token);
      resolve(false);
    };
    iframe.onload=()=>{
      clearTimeout(token);
      resolve(true);
    };
  });
  return p;
}