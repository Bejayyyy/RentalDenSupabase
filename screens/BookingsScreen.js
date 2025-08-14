import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const orders = [
  { id: '1', name: 'John Smith', date: 'Aug 21, 2024', amount: '+$10.00', badge: 'New Order', initials: 'JS', status: 'confirmed' },
  { id: '2', name: 'Adam James', date: 'Aug 21, 2024', amount: '+$8.50', badge: 'New Order', initials: 'AJ', status: 'pending' },
  { id: '3', name: 'Clara David', date: 'Aug 20, 2024', amount: '+$14.00', badge: 'New Order', initials: 'CD', status: 'completed' },
  { id: '4', name: 'Emily John', date: 'Aug 19, 2024', amount: '+$12.30', badge: 'New Order', initials: 'EJ', status: 'confirmed' },
];

export default function BookingsScreen() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
        <Ionicons name="menu" size={28} color="#222" />
      </View>

      {/* Bookings summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Booking Overview</Text>
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

      {/* Booking List title */}
      <View style={styles.listHeaderCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.filterButton}>Monthly</Text>
            <Text style={styles.filterButtonActive}>Weekly</Text>
            <Text style={styles.filterButton}>Today</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.bookingInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.bookingDate}>{item.date}</Text>
      </View>
      <Text style={styles.bookingAmount}>{item.amount}</Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  summaryCard: {
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
  listHeaderCard: {
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
  cardHeader: {
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
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#374151',
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookingAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  listContainer: {
    paddingBottom: 20,
  },
});