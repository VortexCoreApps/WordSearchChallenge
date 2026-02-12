package com.wordsearch.challenge;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Enable Edge-to-Edge
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Fix: Android WebView blank screen after app is backgrounded.
        // When the system destroys the Activity's rendering surface to reclaim memory,
        // the WebView may fail to re-render on resume. Force a layout pass and
        // inject a no-op style change to trigger a full repaint.
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            try {
                WebView webView = getBridge().getWebView();
                if (webView != null) {
                    // Force the native view hierarchy to re-layout
                    webView.requestLayout();

                    // Force a visibility toggle to ensure the GL surface is recreated
                    webView.setVisibility(android.view.View.INVISIBLE);
                    webView.postDelayed(() -> {
                        webView.setVisibility(android.view.View.VISIBLE);

                        // Inject a DOM-level repaint trigger as a safeguard
                        webView.evaluateJavascript(
                                "(function(){" +
                                        "  var b = document.body;" +
                                        "  if(b) {" +
                                        "    b.style.display = 'none';" +
                                        "    void b.offsetHeight;" + // force reflow
                                        "    b.style.display = '';" +
                                        "  }" +
                                        "})()",
                                null);
                    }, 100);
                }
            } catch (Exception e) {
                // Silently ignore — Bridge might not be ready yet on first launch
            }
        }, 200);
    }
}
