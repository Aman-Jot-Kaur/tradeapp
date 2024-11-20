import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Autocomplete from 'react-native-autocomplete-input';

const screenWidth = Dimensions.get('window').width;
const graphWidth = screenWidth * 0.9;

const Graph = () => {
  const [liveData, setLiveData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://api.grandprimeforex.com:3001/fetch-data');
        const result = await response.json();
        const data = result.data;
        const selectedAssetData = data.find((item) => item.asset === selectedAsset);

        if (selectedAssetData) {
          const bid = parseFloat(selectedAssetData.bid);
          const timestamp = new Date().toLocaleTimeString();

          setLiveData((prevData) => [...prevData.slice(-4), bid]);
          setLabels((prevLabels) => [...prevLabels.slice(-4), timestamp]);
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 2000);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  const filteredAssets = query
    ? assets.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === 'line' ? 'bar' : 'line'));
  };

  const handleSelectItem = (item) => {
    setSelectedAsset(item.value);
    setQuery(item.label);
    // Hide the list after selection
    setTimeout(() => {
      setQuery(''); // Clear the input field
    }, 200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Autocomplete
          data={filteredAssets}
          defaultValue={query}
          onChangeText={(text) => setQuery(text)}
          onSelectItem={(item) => handleSelectItem(item)}
          flatListProps={{
            keyExtractor: (item) => item.value,
            renderItem: ({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.suggestionText}>{item.label}</Text>
              </TouchableOpacity>
            ),
          }}
          placeholder="Type to search..."
          
          inputContainerStyle={styles.autocompleteContainer}
          listContainerStyle={styles.listContainer}
          listStyle={styles.list}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.selectedAssetText}>
          Selected Asset: {selectedAsset}
        </Text>

        <View style={styles.chartContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            labels.length > 0 && (
              chartType === 'line' ? (
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [{ data: liveData }],
                  }}
                  width={graphWidth}
                  height={250}
                  yAxisLabel={'$'}
                  chartConfig={chartConfig}
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
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              )
            )
          )}
        </View>
        <Button
          title={`Switch to ${chartType === 'line' ? 'Bar' : 'Line'} Chart`}
          onPress={toggleChartType}
          color="#007bff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  topBar: { marginBottom: 10 },
  autocompleteContainer: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContainer: {
    backgroundColor: 'black',
    borderRadius: 8,
    zIndex: 10,  // Ensure list is above the graph
  },
  list: { maxHeight: 150 },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    backgroundColor: 'black',
    borderBottomColor: '#333',
  },
  suggestionText: { color: 'white', fontSize: 16 },
  selectedAssetText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  chartContainer: { marginTop: 20, alignItems: 'center' },
  chartStyle: { marginVertical: 8, borderRadius: 16 },
});

const chartConfig = {
  decimalPlaces: 2,
  backgroundColor: '#000',
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

export default Graph;
