import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import SwipeLocations from './SwipeLocations'; // Import the swipe component
import Papa from 'papaparse';

const RecommendedLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('path/to/purdue_spots.csv'); // Adjust the path as needed
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result.value);

      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          setLocations(results.data);
        },
      });
    };

    fetchData();
  }, []);

  const handleSwipe = async (location, action) => {
    // Handle the swipe action (e.g., save to user's preferences)
    if (action === 'yes') {
      console.log('Added to yes:', location);
      // Add logic to save the location to the user's "yes" list
    } else {
      console.log('Added to no:', location);
      // Add logic to save the location to the user's "no" list
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Locations</Text>
      {locations.length > 0 ? (
        <SwipeLocations locations={locations} onSwipe={handleSwipe} />
      ) : (
        <Text>Loading locations...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RecommendedLocations; 