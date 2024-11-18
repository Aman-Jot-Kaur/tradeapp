import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';

const screenWidth = Dimensions.get('window').width;
const graphWidth = screenWidth * 0.9;

const Graph = () => {
  const [liveData, setLiveData] = useState([]); // Live data from Forex API
  const [labels, setLabels] = useState([]); // Timestamps for chart
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [chartType, setChartType] = useState('line'); // Line or Bar chart
  const [loading, setLoading] = useState(true); // Loader state

  // Fetch available assets on mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('https://api.grandprimeforex.com:3001/fetch-data');
        const result = await response.json();
        const assetOptions = result.data.map((item) => ({
          label: item.asset,
          value: item.asset,
        }));
        setAssets(assetOptions);
        setLoading(false); // Data loaded, hide the loader
      } catch (error) {
        console.error('Error fetching assets:', error);
        setLoading(false); // In case of error, hide the loader
      }
    };
    fetchAssets();
  }, []);

  // Reset data when asset changes
  useEffect(() => {
    setLiveData([]); // Clear live data
    setLabels([]); // Clear labels
  }, [selectedAsset]);

  // Fetch live data every 2 seconds
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://api.grandprimeforex.com:3001/fetch-data');
        const result = await response.json();
        const data = result.data;
        if (Array.isArray(data)) {
          const selectedAssetData = data.find((item) => item.asset === selectedAsset);
          if (selectedAssetData) {
            const bid = parseFloat(selectedAssetData.bid);
            const timestamp = new Date().toLocaleTimeString();
            setLiveData((prevData) => [...prevData.slice(-4), bid]);
            setLabels((prevLabels) => [...prevLabels.slice(-4), timestamp]);
          }
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    const interval = setInterval(fetchLiveData, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedAsset]);

  // Toggle between chart types
  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : 'line'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedAsset(value)}
            items={assets}
            value={selectedAsset}
            placeholder={{ label: 'Select an asset...', value: null }}
            style={{
              inputIOS: pickerStyles.inputIOS,
              inputAndroid: pickerStyles.inputAndroid,
              placeholder: pickerStyles.placeholder,
            }}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.stockInfo}>
          <Text style={styles.stockTitle}>{selectedAsset}</Text>
        </View>

        <View style={styles.chartContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          ) : (
            <View style={styles.chartWrapper}>
              {labels.length > 0 ? (
                chartType === 'line' ? (
                  <LineChart
                    data={{
                      labels: labels, // Latest labels
                      datasets: [{ data: liveData }], // Latest data points
                    }}
                    width={graphWidth}
                    height={250}
                    yAxisLabel={'$'}
                    chartConfig={{
                      decimalPlaces: 5,
                      backgroundColor: '#000',
                      backgroundGradientFrom: '#1E2923',
                      backgroundGradientTo: '#08130D',
                      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                        padding:5
                        
                      },
                      propsForDots: {
                        r: '3',
                        strokeWidth: '1',
                        stroke: '#00ff00',
                      },
                    }}
                    bezier
                    style={styles.chartStyle}
                  />
                ) : (
                  <BarChart
                    data={{
                      labels: labels,
                      datasets: [{ data: liveData }],
                    }}
                    width={graphWidth}
                    height={250}
                    yAxisLabel={'$'}
                    chartConfig={{
                      decimalPlaces: 5,
                      backgroundColor: '#000',
                      backgroundGradientFrom: '#1E2923',
                      backgroundGradientTo: '#08130D',
                      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                    }}
                    style={styles.chartStyle}
                  />
                )
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.button}>
          <Button
            title={`Switch to ${chartType === 'line' ? 'Bar' : 'Line'} Chart`}
            onPress={toggleChartType}

          /></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBar: { flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#000' },
  stockInfo: { flexDirection: 'row', paddingTop: 50, paddingBottom: 20 },
  stockTitle: { paddingLeft: 2, color: 'white', fontSize: 22 },
  content: { flex: 1 },
  chartContainer: { alignItems: 'center', marginTop: 20 },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
  dropdownContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loaderContainer: {
    display:"flex",
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    marginTop: 20
  },
  chartWrapper:{
    paddingHorizontal: 10,
    width: '100%',
    alignItems: 'center'
  }
});

const pickerStyles = {
  inputIOS: {
    height: 50,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 18,
    color: 'white',
    backgroundColor: '#2b2b2b',
  },
  inputAndroid: {
    height: 50,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 18,
    color: 'white',
    backgroundColor: '#2b2b2b',
  },
  placeholder: {
    color: '#ccc',
    fontSize: 18,
  },
};

export default Graph;
