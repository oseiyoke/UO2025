if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(n[c])return;let t={};const o=e=>s(e,c),r={module:{uri:c},exports:t,require:o};n[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(a(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"b2ca69165f9cf6a4a4b7b43c7fa9b299"},{url:"/_next/static/C2n0zEeUQv6nGmwiRJQ3V/_buildManifest.js",revision:"c7de0aa23f274e7cc17f24d9516b11db"},{url:"/_next/static/C2n0zEeUQv6nGmwiRJQ3V/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/294.e72d2554be082393.js",revision:"e72d2554be082393"},{url:"/_next/static/chunks/4bd1b696-c991ab569c3eb555.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/684-b60934aa3d170249.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/766-36d945e4b953bab4.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/851-c6952f3282869f27.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/874-86c66e622de082c9.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/_not-found/page-ce44096266539353.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/layout-e6fa680a5a49b63a.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/offline/page-99d155da4c99fd9e.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/page-de0df0ac603984f2.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/program/page-fc600913284f1f19.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/request-song/page-16c1314ca6aced0a.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/requested-songs/page-cc276492087c4b75.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/app/wall-of-love/page-21476d04aed1ef65.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/framework-f593a28cde54158e.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/main-6b22041cb95dac0b.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/main-app-3360a5c03d1ef938.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/pages/_app-da15c11dea942c36.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-83104ce46c2cbd94.js",revision:"C2n0zEeUQv6nGmwiRJQ3V"},{url:"/_next/static/css/770a40e720ed83e8.css",revision:"770a40e720ed83e8"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/favicon.ico",revision:"7215ee9c7d9dc229d2921a40e899ec5f"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/icon-128x128.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-144x144.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-152x152.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-192x192.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-384x384.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-512x512.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-72x72.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/icons/icon-96x96.png",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/manifest.json",revision:"3802b31a5a5eea2e0e4d3241e741bc09"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/wedding-logo/UO2025.png",revision:"dd4409afffe8268ec7601a73cb521173"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:n,event:s,state:i})=>n&&"opaqueredirect"===n.type?new Response(n.body,{status:200,statusText:"OK",headers:n.headers}):n}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const n=e.pathname;return!n.startsWith("/api/auth/")&&!!n.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
