package com.wordsearch.challenge;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebView;

import androidx.activity.EdgeToEdge;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
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
                    // Pass 1: Force layout recalculation
                    webView.requestLayout();
                    webView.invalidate();

                    // Pass 2: Gentle resize trick — nudge the view by 1px and back
                    // This forces the GPU surface to reattach without any visible flash
                    android.view.ViewGroup.LayoutParams lp = webView.getLayoutParams();
                    if (lp != null) {
                        int originalHeight = lp.height;
                        lp.height = lp.height == android.view.ViewGroup.LayoutParams.MATCH_PARENT
                                ? android.view.ViewGroup.LayoutParams.MATCH_PARENT
                                : lp.height;
                        webView.setLayoutParams(lp);
                        webView.postDelayed(() -> {
                            lp.height = originalHeight;
                            webView.setLayoutParams(lp);
                        }, 16); // 1 frame
                    }

                    // Pass 3: Force a DOM recomposite via JavaScript WITHOUT hiding body
                    webView.postDelayed(() -> {
                        webView.evaluateJavascript(
                                "(function(){" +
                                        "  var r = document.getElementById('root');" +
                                        "  if(r) {" +
                                        "    r.style.transform = 'translateZ(0)';" +
                                        "    void r.offsetHeight;" +
                                        "    r.style.transform = '';" +
                                        "  }" +
                                        "})()",
                                null);
                    }, 50);
                }
            } catch (Exception e) {
                // Silently ignore
            }
        }, 100); // Reduced delay — 100ms is enough after OS transition
    }

    @Override
    public void onResume() {
        super.onResume();
        // Fallback or additional pass on resume
        triggerWebViewRepaint();
    }
}
