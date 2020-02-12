/**
* @description 主应用
* @author YuanZiWen
* @since 2019-12-16
*/


import fetch from 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun';

// import Vue from 'vue';
// import Framework from './Framework.vue';

import Framework from './Framework';

const IS_PROD = process.env.NODE_ENV === 'production';
// let app = null;

function render({ appContent, loading }) {
  /*
  examples for vue
   */
  // if (!app) {
  //   app = new Vue({
  //     el: '#container',
  //     data() {
  //       return {
  //         content: appContent,
  //         loading,
  //       };
  //     },
  //     render(h) {
  //       return h(Framework, {
  //         props: {
  //           content: this.content,
  //           loading: this.loading,
  //         },
  //       });
  //     },
  //   });
  // } else {
  //   app.content = appContent;
  //   app.loading = loading;
  // }

  const container = document.getElementById('container');
  ReactDOM.render(<Framework loading={loading} content={appContent} />, container);
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });

// support custom fetch see: https://github.com/kuitos/import-html-entry/blob/91d542e936a74408c6c8cd1c9eebc5a9f83a8dc0/src/index.js#L163
const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin',
  });


registerMicroApps(
  [
    { name: 'apps', entry: IS_PROD ? '//apps.yuanziwen.cn' : '//localhost:7101', render, activeRule: genActiveRule('/apps') },
    { name: 'performance', entry: IS_PROD ? '//performance.yuanziwen.cn' : '//localhost:7102', render, activeRule: genActiveRule('/performance') },
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app);
      },
    ],
    beforeMount: [
      app => {
        console.log('before mount', app);
      },
    ],
    afterUnmount: [
      app => {
        console.log('after unload', app);
      },
    ],
  },
  {
    fetch: request,
  },
);

setDefaultMountApp('/');
runAfterFirstMounted(() => console.info('first app mounted'));

start({ prefetch: true, fetch: request });
