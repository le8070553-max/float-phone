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

// 屏幕兼容兜底（对齐手机端 @media (hover:none)+(pointer:coarse) 块）：
// 安卓 WebView 里 navigator.maxTouchPoints 可能是 0、媒体查询也可能不命中，
// 结果真手机被当成桌面，套上 390px 手机模型后左右/底部被裁。
// 这里改按「视口宽度」判断：窄屏（<=620）一律打 data-force-mobile，
// 由下面这组样式把手机壳取消、界面铺满整个视口。
const SHELL_FIX_SCRIPT = `(function(){try{var d=document.documentElement;var w=window.innerWidth||0;if(w>0&&w<=620){d.setAttribute("data-force-mobile","1");}}catch(e){}})();`;

const SHELL_FIX_CSS = `html[data-force-mobile]{--phone-screen-width:100vw;--phone-screen-height:100vh}
html[data-force-mobile],html[data-force-mobile] body{overflow:hidden;width:100%;height:100%;background:var(--c-page-body-bg)}
html[data-force-mobile] .app-root{width:100vw;height:100vh;padding:0;display:flex;justify-content:flex-start;align-items:flex-start;overflow:hidden;background:var(--c-page-body-bg)}
html[data-force-mobile] .phone-shell-wrap{--phone-case-padding:0px;--phone-case-border-size:0px;--phone-frame-size:0px;--phone-screen-radius:0px;--phone-frame-radius:0px;--phone-case-radius:0px;width:var(--phone-screen-width);margin-inline:0;gap:0;transform-origin:top left;margin-top:calc(-1 * var(--status-bar-drop, 0px));transform:translate3d(0, calc(-1 * var(--mobile-keyboard-lift, 0px)), 0)}
html[data-force-mobile] .phone-shell-wrap .phone-case{padding:0;border:0;background:transparent;box-shadow:none}
html[data-force-mobile] .phone-shell-wrap .phone-case::before,html[data-force-mobile] .phone-shell-wrap .phone-case::after{display:none}
html[data-force-mobile] .phone-shell-wrap .phone-frame{padding:0;background:transparent;box-shadow:none}
html[data-force-mobile] .phone-shell-wrap .phone-frame::before,html[data-force-mobile] .phone-shell-wrap .phone-frame::after{display:none}
html[data-force-mobile] .phone-shell{padding:12px;border-radius:0}
html[data-force-mobile] .app-root.splash-root{width:100vw;height:100vh;margin:0;padding:0;display:flex;align-items:flex-start;justify-content:flex-start;overflow:hidden;background:var(--c-page-body-bg)}
html[data-force-mobile] .splash-shell-wrap{width:var(--phone-screen-width);transform-origin:top left}
html[data-force-mobile] .splash-shell-wrap .phone-case,html[data-force-mobile] .splash-shell-wrap .phone-frame{width:var(--phone-screen-width)}`;

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
