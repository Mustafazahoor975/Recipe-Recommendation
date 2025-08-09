import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CategoriesScreen = () => {
  const [categories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Fast Food']);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/recipe', params: { category: item } })}>
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { backgroundColor: '#eee', padding: 15, marginVertical: 10, borderRadius: 10 },
  text: { fontSize: 20, fontWeight: 'bold' },
});
