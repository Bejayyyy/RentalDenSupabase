import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function DashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const todayStr = today.toISOString().split('T')[0];

      // Fetch vehicles
      const { data: vehicles, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*');
      if (vehicleError) throw vehicleError;

      // Fetch bookings
      const { data: bookings, error: bookingError } = await supabase
        .from('bookings')
        .select('*');
      if (bookingError) throw bookingError;

      const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
      const todayBookings = bookings.filter(b => b.rentalDate?.startsWith(todayStr)).length;
      const monthlyRevenue = bookings
        .filter(b => b.status === 'completed' && new Date(b.rentalDate) >= startOfMonth)
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const recentBookings = bookings
        .sort((a, b) => new Date(b.rentalDate) - new Date(a.rentalDate))
        .slice(0, 5);

      setDashboardData({
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.available).length,
        activeBookings,
        todayBookings,
        monthlyRevenue,
        recentBookings
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Live updates
    const vehiclesSub = supabase
      .channel('vehicles_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, fetchDashboardData)
      .subscribe();

    const bookingsSub = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(vehiclesSub);
      supabase.removeChannel(bookingsSub);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        <Ionicons name={icon} size={28} color={color} style={styles.statIcon} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#222" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} />
        }
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Total Vehicles"
            value={dashboardData.totalVehicles}
            icon="car"
            color="#4CAF50"
            onPress={() => navigation.navigate('Vehicles')}
          />
          <StatCard
            title="Available"
            value={dashboardData.availableVehicles}
            icon="checkmark-circle"
            color="#2196F3"
            onPress={() => navigation.navigate('Vehicles')}
          />
          <StatCard
            title="Active Rentals"
            value={dashboardData.activeBookings}
            icon="time"
            color="#FF9800"
            onPress={() => navigation.navigate('Bookings')}
          />
          <StatCard
            title="Today's Bookings"
            value={dashboardData.todayBookings}
            icon="calendar"
            color="#9C27B0"
            onPress={() => navigation.navigate('Bookings')}
          />
        </View>

        {/* Revenue */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.sectionTitle}>Monthly Revenue</Text>
          </View>
          <View style={styles.revenueContent}>
            <View>
              <Text style={styles.revenueValue}>
                ${dashboardData.monthlyRevenue.toFixed(2)}
              </Text>
              <Text style={styles.revenueSubtext}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <View style={styles.revenueIconContainer}>
              <Ionicons name="trending-up" size={32} color="#4CAF50" />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="Add Vehicle"
              description="Add new vehicle to fleet"
              icon="add-circle"
              color="#FF6B35"
              onPress={() => navigation.navigate('Vehicles', { screen: 'AddVehicle' })}
            />
            <QuickActionCard
              title="View Calendar"
              description="Check rental schedule"
              icon="calendar"
              color="#2196F3"
              onPress={() => navigation.navigate('Calendar')}
            />
            <QuickActionCard
              title="Cash Flow"
              description="Manage transactions"
              icon="cash"
              color="#4CAF50"
              onPress={() => navigation.navigate('Reports', { screen: 'CashFlow' })}
            />
            <QuickActionCard
              title="Reports"
              description="View performance data"
              icon="analytics"
              color="#9C27B0"
              onPress={() => navigation.navigate('Reports')}
            />
          </View>
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {dashboardData.recentBookings.length > 0 ? (
            dashboardData.recentBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingItem}>
                <View style={styles.bookingLeft}>
                  <View
                    style={[
                      styles.bookingStatus,
                      { backgroundColor: booking.status === 'confirmed' ? '#4CAF50' : '#FF9800' }
                    ]}
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingCustomer}>{booking.customerName}</Text>
                    <Text style={styles.bookingVehicle}>
                      {booking.vehicleMake} {booking.vehicleModel}
                    </Text>
                  </View>
                </View>
                <Text style={styles.bookingAmount}>${booking.totalAmount}</Text>
                <Text
                  style={[
                    styles.bookingTrend,
                    { color: booking.status === 'confirmed' ? '#10b981' : '#ef4444' }
                  ]}
                >
                  {booking.status}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent bookings</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 8 },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  logoutButton: { padding: 8 },
  scrollView: { flex: 1 },
  scrollContainer: { paddingBottom: 20 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  statCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, width: '47%', borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  statContent: { alignItems: 'center' },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  statTitle: { color: '#374151', fontSize: 12, fontWeight: '500' },
  revenueCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e5e7eb' },
  revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  revenueContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  revenueValue: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50', marginBottom: 4 },
  revenueSubtext: { fontSize: 14, color: '#9ca3af', fontWeight: '500' },
  revenueIconContainer: { backgroundColor: '#4CAF5020', padding: 12, borderRadius: 12 },
  section: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontWeight: '800', fontSize: 18, letterSpacing: -0.5 },
  viewAllText: { fontSize: 14, color: '#FF6B35', fontWeight: '600' },
  actionsGrid: { gap: 12 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  actionIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  actionDescription: { fontSize: 12, color: '#6b7280' },
  bookingItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: 'white', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  bookingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  bookingStatus: { width: 4, height: 40, borderRadius: 8, marginRight: 12 },
  bookingInfo: { flex: 1 },
  bookingCustomer: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  bookingVehicle: { fontSize: 12, color: '#6b7280' },
  bookingAmount: { fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  bookingTrend: { fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { color: '#9ca3af', fontWeight: '500' }
});
