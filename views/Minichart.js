import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TradingViewForexScreenerWidget = () => {
  // TradingView Forex Screener widget HTML content
  const tradingViewHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TradingView Forex Screener</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: rgb(26, 26, 29);
                color: white;
                font-family: Arial, sans-serif;
                height: 100vh; /* Full height */
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .tradingview-widget-container {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
        </style>
    </head>
    <body>
        <div class="tradingview-widget-container">
            <div id="tradingview-screener"></div>
            <script type="text/javascript"
                src="https://s3.tradingview.com/external-embedding/embed-widget-screener.js" 
                async>
            {
                "width": "100%",
                "height": "100%",
                "defaultColumn": "performance",
                "defaultScreen": "general",
                "market": "forex",
                "showToolbar": true,
                "colorTheme": "dark",
                "locale": "en"
            }
            </script>
        </div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: tradingViewHTML }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(26, 26, 29)',
  },
  webview: {
    flex: 1,
    height:6000 // Ensures the WebView takes up the full height of the parent container
  },
});

export default TradingViewForexScreenerWidget;
