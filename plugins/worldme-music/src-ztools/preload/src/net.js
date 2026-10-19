/**
 * 网络层
 * 统一配置 axios（Node http 适配器，绕过渲染层 CORS），并提供下载/请求辅助函数。
 * 音源插件通过 require('axios') 拿到的是这里配置过的同一个实例。
 */
const https = require('https');
const http = require('http');
const axios = require('axios');

const insecureAgent = new https.Agent({ rejectUnauthorized: false, keepAlive: true });

axios.defaults.timeout = 20000;
axios.defaults.maxRedirects = 6;
axios.defaults.httpsAgent = insecureAgent;
try {
  // 强制使用 Node http 适配器，避免渲染进程中的 XHR/CORS 限制
  // axios 0.27 的 defaults.adapter 期望函数，不能传字符串
  axios.defaults.adapter = require('axios/lib/adapters/http');
} catch (e) {
  try {
    delete axios.defaults.adapter;
  } catch (e2) {
    /* ignore */
  }
}

/** 追加随机参数，绕过部分 CDN 缓存（等价 MusicFree 的 addRandomHash） */
function addRandomHash(url) {
  if (typeof url !== 'string') return url;
  try {
    const u = new URL(url);
    u.searchParams.set('_t', Date.now() + Math.random().toString(36).slice(2, 8));
    return u.toString();
  } catch (e) {
    return url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
  }
}

function fetchText(url, options) {
  return axios.get(url, options).then((res) => res.data);
}

function fetchJSON(url, options) {
  return axios.get(url, options).then((res) => res.data);
}

/** 请求原始二进制流（用于媒体代理） */
function requestStream(targetUrl, headers, method) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (e) {
      reject(new Error('无效的地址: ' + targetUrl));
      return;
    }
    const lib = parsed.protocol === 'http:' ? http : https;
    const reqOptions = {
      method: method || 'GET',
      headers: Object.assign(
        {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          Accept: '*/*',
        },
        headers || {}
      ),
    };
    if (parsed.protocol === 'https:') reqOptions.agent = insecureAgent;

    const req = lib.request(parsed, reqOptions, (res) => {
      const status = res.statusCode || 0;
      // 跟随重定向
      if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
        res.resume();
        let next = res.headers.location;
        if (!/^https?:\/\//i.test(next)) next = new URL(next, targetUrl).toString();
        requestStream(next, headers, method).then(resolve, reject);
        return;
      }
      resolve(res);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('请求超时'));
    });
    req.end();
  });
}

module.exports = {
  axios,
  insecureAgent,
  addRandomHash,
  fetchText,
  fetchJSON,
  requestStream,
};
