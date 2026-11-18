import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ChatPluginBootstrap } from "@/components/chat-plugin-bootstrap";
import { ChatReasoningVisibilityController } from "@/components/chat-reasoning-visibility-controller";
import { CSSImportEnhancer } from "@/components/css-import-enhancer";
import { PWAManifestInjector } from "@/components/pwa-manifest-injector";
import { PWARegistrar } from "@/components/pwa-registrar";
import "../styles/fonts.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "float",
  description: "float",
};

// 手机壳兜底：安卓 WebView 有时不认 (hover: none) and (pointer: coarse)，
// 真手机被当成桌面，套上一层手机模型后左右被裁。
// 这里按「物理屏幕短边 + 触摸点数」强制手机排版，并把 390x844 设计稿整体缩放铺满物理屏。
// 只对触摸设备、物理短边 <=620 生效，桌面浏览器完全不受影响。
const SHELL_FIX_SCRIPT = `(function(){try{var s=window.screen;var w=Math.min(s.width,s.height);var touch=(navigator.maxTouchPoints||0)>0;var mq=window.matchMedia("(max-width: 500px) and (hover: none) and (pointer: coarse)").matches;if(touch&&w>0&&w<=620&&!mq){var d=document.documentElement;d.setAttribute("data-force-mobile","1");var z=Math.min(s.width/390,s.height/844);if(isFinite(z)&&z>0){d.style.setProperty("--fp-scale",z.toFixed(4));}}}catch(e){}})();`;

const SHELL_FIX_CSS = `html[data-force-mobile]{--phone-screen-width:390px;--phone-screen-height:844px}
html[data-force-mobile],html[data-force-mobile] body{width:100%;height:100%;overflow:hidden;background:#f1f2f6}
html[data-force-mobile] .app-root{position:fixed;left:0;top:0;width:390px;height:844px;max-width:none;padding:0;margin:0;overflow:hidden;display:block;transform:scale(var(--fp-scale,1));transform-origin:top left;background:transparent}
html[data-force-mobile] .phone-shell-wrap{width:390px!important;margin:0!important;gap:0!important;transform:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-case{width:390px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-case::before,html[data-force-mobile] .phone-shell-wrap .phone-case::after{display:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-frame{width:390px!important;padding:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-frame::before,html[data-force-mobile] .phone-shell-wrap .phone-frame::after{display:none!important}
html[data-force-mobile] .phone-shell{width:390px!important;height:844px!important;border-radius:0!important}
html[data-force-mobile] .phone-screen{width:390px!important;height:844px!important;border-radius:0!important}`;

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: SHELL_FIX_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: SHELL_FIX_CSS }} />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <meta name="theme-color" content="#f8f7f2" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="float" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <PWAManifestInjector />
        <PWARegistrar />
        <CSSImportEnhancer />
        <ChatPluginBootstrap />
        <ChatReasoningVisibilityController />
        {children}
      </body>
    </html>
  );
}
