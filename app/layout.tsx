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

// 屏幕兼容兜底：安卓 WebView 常把真机当桌面，套 390px 手机模型后左右/底部被裁。
// 这里直接打 data-force-mobile，用 !important 盖过站点脚本写在元素上的行内尺寸，
// 把手机壳取消、界面铺满整个视口。
const SHELL_FIX_SCRIPT = `(function(){try{document.documentElement.setAttribute("data-force-mobile","1");}catch(e){}})();`;

const SHELL_FIX_CSS = `html[data-force-mobile]{--phone-screen-width:100vw!important;--phone-screen-height:100vh!important;--phone-case-padding:0px!important;--phone-case-border-size:0px!important;--phone-frame-size:0px!important;--phone-screen-radius:0px!important;--phone-frame-radius:0px!important;--phone-case-radius:0px!important}
html[data-force-mobile],html[data-force-mobile] body{overflow:hidden!important;width:100%!important;height:100%!important;background:var(--c-page-body-bg)!important}
html[data-force-mobile] .app-root,html[data-force-mobile] .app-root.splash-root{position:fixed!important;left:0!important;top:0!important;width:100vw!important;height:100vh!important;max-width:none!important;min-height:0!important;margin:0!important;padding:0!important;display:flex!important;justify-content:flex-start!important;align-items:flex-start!important;overflow:hidden!important;transform:none!important;background:var(--c-page-body-bg)!important}
html[data-force-mobile] .phone-shell-wrap,html[data-force-mobile] .splash-shell-wrap{width:100vw!important;max-width:none!important;margin:0!important;margin-inline:0!important;gap:0!important;transform:none!important;transform-origin:top left!important}
html[data-force-mobile] .phone-shell-wrap .phone-case,html[data-force-mobile] .splash-shell-wrap .phone-case{padding:0!important;border:0!important;width:100vw!important;max-width:none!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-case::before,html[data-force-mobile] .phone-shell-wrap .phone-case::after,html[data-force-mobile] .splash-shell-wrap .phone-case::before,html[data-force-mobile] .splash-shell-wrap .phone-case::after{display:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-frame,html[data-force-mobile] .splash-shell-wrap .phone-frame{padding:0!important;border:0!important;width:100vw!important;max-width:none!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
html[data-force-mobile] .phone-shell-wrap .phone-frame::before,html[data-force-mobile] .phone-shell-wrap .phone-frame::after,html[data-force-mobile] .splash-shell-wrap .phone-frame::before,html[data-force-mobile] .splash-shell-wrap .phone-frame::after{display:none!important}
html[data-force-mobile] .phone-shell{width:100vw!important;height:100vh!important;min-height:0!important;border-radius:0!important;padding:12px!important;transform:none!important}
html[data-force-mobile] .phone-screen{width:100vw!important;height:100vh!important;border-radius:0!important}`;

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
