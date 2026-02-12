package com.wordsearch.challenge;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Enable Edge-to-Edge
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);

        // If we regained focus, and it's not the first launch, force a redraw.
        // This is specifically to fix the "blank screen" bug in Android WebViews
        // when returning from background or closing an ad/system dialog.
        if (hasFocus) {
            triggerWebViewRepaint();
        }
    }

    private void triggerWebViewRepaint() {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            try {
                WebView webView = getBridge().getWebView();
                if (webView != null) {
                    // Pass 1: Force layout and invalidate
                    webView.requestLayout();
                    webView.invalidate();

                    // Pass 2: Toggle visibility with a small delay
                    // This often forces the native GL surface to reattach
                    webView.setVisibility(View.INVISIBLE);
                    webView.postDelayed(() -> {
                        webView.setVisibility(View.VISIBLE);
                        webView.requestLayout(); // second pass

                        // Pass 3: Force a DOM reflow via JavaScript
                        // We also scroll 1px and back to trigger browser-level composite pass
                        webView.evaluateJavascript(
                                "(function(){" +
                                        "  var b = document.body;" +
                                        "  if(b) {" +
                                        "    var oldPos = window.scrollY;" +
                                        "    b.style.display = 'none';" +
                                        "    void b.offsetHeight;" + // force reflow
                                        "    b.style.display = '';" +
                                        "    window.scrollTo(0, oldPos + 1);" +
                                        "    window.scrollTo(0, oldPos);" +
                                        "  }" +
                                        "})()",
                                null);
                    }, 50);
                }
            } catch (Exception e) {
                // Silently ignore
            }
        }, 300); // 300ms delay to allow the OS to finish the window transition
    }

    @Override
    public void onResume() {
        super.onResume();
        // Fallback or additional pass on resume
        triggerWebViewRepaint();
    }
}
