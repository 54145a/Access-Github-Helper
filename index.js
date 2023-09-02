"use strict";

/**配置 */
/**超时时间 */
let timeout_ms = 1000;
/**要检测的ip */
let ips = {
  "github.com": "自动路由到最近服务器",
  "20.205.243.166": "新加坡",
  "20.27.177.113": "日本",
  "20.200.245.247": "韩国",
  "20.207.73.82": "印度",
  "20.248.137.48": "澳大利亚",
  "192.30.255.113": "美国",
  "20.87.225.212": "南非",
  "20.233.83.145": "阿拉伯联合酋长国",
  "20.201.28.151": "巴西",
  "kgithub.com":"镜像网站，只读，无法进行登录等操作",
  "baidu.com": "如果这一条检测失败，说明代码运行出现问题",
  "google.com": "这一条用于检测您的网络环境"
}
/**ip状态代码 */
const IP_STATUS_CODE = {
  loading: 0,
  ok: 1,
  failed: 2,
}

/**最快ip */
let fastestIP = null;

/**ip monitor div */
let monitor = document.querySelector("#ipmonitor");

/**初始化页面 */
init();

/**检测ip */
check();

/**
 * 检测URL
 * @param {string} url 地址
 * @returns 状态码
 */
function testUrl(url) {
  let image = new Image();
  image.src = url + "favicon.ico?timestamp="+Date.now();
  image.style.display = "none";
  document.body.appendChild(image);
  return new Promise((resolve) => {
    let token = setTimeout(() => {
      image.onerror = image.onload = null;
      resolve(2);
    }, timeout_ms);
    image.onerror = () => {
      clearTimeout(token);
      resolve(2);
    };
    image.onload = () => {
      clearTimeout(token);
      resolve(1);
    };
  });
}

/**
 * 初始化页面
 */
function init(){
  /**读取设置，如果没有就创建 */
  timeout_ms = localStorage.getItem("timeout_ms");
  if(!timeout_ms){
    localStorage.setItem("timeout_ms", 1000);
  }
  timeout_ms = Number(timeout_ms);

  /**在页面上展示设置 */
  let settingDiv = document.getElementById("settings");
  let timeoutMsInput = settingDiv.querySelector("#timeout");
  timeoutMsInput.value = timeout_ms;

  /**获取模板元素 */
  let template = document.getElementById("template");

  /**向页面中添加ip显示 */
  for(let ip in ips){
    /**获得模板内容 */
    let content = template.content.cloneNode(true);

    /**写入信息 */
    content.querySelector(".ip").innerText = ip;
    content.querySelector(".info").innerText = ips[ip];
    content.querySelector(".part").id = ip2ClassString(ip);
    content.querySelector(".go").href = `https://${ip}/`;

    /**显示到页面 */
    monitor.appendChild(content);

    updateStatus(ip, IP_STATUS_CODE.loading)
  }
}

/**
 * 更新页面状态展示
 * @param {string} ip ip
 * @param {number} state 状态
 */
async function updateStatus(ip, state){
  let ipel = document.getElementById(ip2ClassString(ip));
  if(!ipel){
    return ;
  }
  if(state == IP_STATUS_CODE.loading){
    ipel.querySelector(".go").innerText = "检测中";
    ipel.classList.add("loading");
  }else{
    ipel.classList.remove("loading");
  }
  if(state == IP_STATUS_CODE.ok){
    ipel.querySelector(".go").innerText = "让我访问！";
    ipel.classList.add("ok");
  }
  if(state == IP_STATUS_CODE.failed){
    ipel.querySelector(".go").innerText = "失效";
    ipel.classList.add("failed");
  }
}

/**
 * 检测ip
 */
function check(){
  for(let ip in ips){
    /**为了让检测尽可能快，将检测添加到消息队列 */
    setTimeout(async () => {
      updateStatus(ip, await testUrl(`https://${ip}/`))
    }, 0);
  }
}

/**
 * 保存设置
 */
function saveSettings(){
  let settingDiv = document.getElementById("settings");
  let timeoutMsInput = settingDiv.querySelector("#timeout");
  localStorage.setItem("timeout_ms", timeoutMsInput.value.toString());
  monitor.innerHTML = "";
  init();
  check();
}

function ip2ClassString(ip){
  return ip.split(".").join("-")
}

function classString2ip(classStr){
  return classStr.split("-").join(".")
}