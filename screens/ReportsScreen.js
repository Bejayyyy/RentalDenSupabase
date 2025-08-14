import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

const trendingItems = [
  { id: '1', name: 'Airdopes', brand: 'boAt', sales: 383, trend: '+12%', positive: true, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64' },
  { id: '2', name: 'DSLR Camera', brand: 'Nikon', sales: 144, trend: '-9%', positive: false, image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=64&h=64' },
];

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={trendingItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Analytics</Text>
              <Feather name="menu" size={28} color="#222" />
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="stats-chart" size={28} color="#222" style={styles.statIcon} />
                <Text style={styles.statValue}>35K</Text>
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trending-up" size={28} color="#222" style={styles.statIcon} />
                <Text style={styles.statValue}>2,153</Text>
                <Text style={styles.statLabel}>Average Sales</Text>
              </View>
            </View>

            {/* Chart Orders */}
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Chart Orders</Text>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterButton}>Monthly</Text>
                  <Text style={styles.filterButtonActive}>Weekly</Text>
                  <Text style={styles.filterButton}>Today</Text>
                </View>
              </View>
              {/* Chart Placeholder */}
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>[Chart Here]</Text>
              </View>
            </View>

            {/* Trending Items Title */}
            <View style={styles.trendingContainer}>
              <View style={styles.trendingHeader}>
                <Text style={styles.sectionTitle}>Trending Items</Text>
                <View style={styles.filterContainer}>
                  <Text style={styles.filterButton}>Monthly</Text>
                  <Text style={styles.filterButtonActive}>Weekly</Text>
                  <Text style={styles.filterButton}>Today</Text>
                </View>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.trendingItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBrand}>{item.brand}</Text>
            </View>
            <Text style={styles.itemSales}>{item.sales}</Text>
            <Text style={[styles.itemTrend, item.positive ? styles.trendPositive : styles.trendNegative]}>
              Sales {item.trend}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
    fontWeight: '600',
  },
  filterButtonActive: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'black',
    color: 'white',
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 144,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  chartPlaceholderText: {
    color: '#9ca3af',
    fontWeight: '500',
  },
  trendingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemBrand: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemSales: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  itemTrend: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendPositive: {
    color: '#10b981',
  },
  trendNegative: {
    color: '#ef4444',
  },
  listContainer: {
    paddingBottom: 20,
  },
});