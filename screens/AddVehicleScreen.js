"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Switch,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../services/firebase"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")
const isWeb = Platform.OS === "web"

export default function AddVehicleScreen({ navigation, route }) {
  const editingVehicle = route?.params?.vehicle
  const isEditing = !!editingVehicle

  const [formData, setFormData] = useState({
    make: editingVehicle?.make || "",
    model: editingVehicle?.model || "",
    year: editingVehicle?.year || "",
    type: editingVehicle?.type || "",
    seats: editingVehicle?.seats?.toString() || "",
    pricePerDay: editingVehicle?.pricePerDay?.toString() || "",
    mileage: editingVehicle?.mileage?.toString() || "",
    description: editingVehicle?.description || "",
    available: editingVehicle?.available ?? true,
    imageUrl: editingVehicle?.imageUrl || null,
  })

  const [loading, setLoading] = useState(false)
  const [imageUri, setImageUri] = useState(editingVehicle?.imageUrl || null)

  const vehicleTypes = ["Sedan", "SUV", "Hatchback", "Convertible", "Truck", "Van", "Luxury"]

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const uploadImage = async (uri) => {
    if (!uri) return null

    try {
      const response = await fetch(uri)
      const blob = await response.blob()

      const filename = `vehicles/${Date.now()}_${Math.random().toString(36).substring(7)}`
      const imageRef = ref(storage, filename)

      await uploadBytes(imageRef, blob)
      const downloadURL = await getDownloadURL(imageRef)

      return downloadURL
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.make || !formData.model || !formData.year || !formData.pricePerDay || !formData.seats) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (Number.parseInt(formData.seats) < 1 || Number.parseInt(formData.seats) > 50) {
      Alert.alert("Error", "Please enter a valid number of seats (1-50)")
      return
    }

    setLoading(true)

    try {
      let imageUrl = formData.imageUrl

      // Upload new image if selected
      if (imageUri && imageUri !== formData.imageUrl) {
        imageUrl = await uploadImage(imageUri)
      }

      const vehicleData = {
        make: formData.make,
        model: formData.model,
        year: Number.parseInt(formData.year),
        type: formData.type,
        seats: Number.parseInt(formData.seats),
        pricePerDay: Number.parseFloat(formData.pricePerDay),
        mileage: formData.mileage ? Number.parseInt(formData.mileage) : null,
        description: formData.description,
        available: formData.available,
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      }

      if (isEditing) {
        await updateDoc(doc(db, "vehicles", editingVehicle.id), vehicleData)
        Alert.alert("Success", "Vehicle updated successfully")
      } else {
        vehicleData.createdAt = new Date().toISOString()
        await addDoc(collection(db, "vehicles"), vehicleData)
        Alert.alert("Success", "Vehicle added successfully")
      }

      navigation.goBack()
    } catch (error) {
      console.error("Error saving vehicle:", error)
      Alert.alert("Error", "Failed to save vehicle. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.label}>Vehicle Type *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScrollView}>
        {vehicleTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, formData.type === type && styles.selectedTypeButton]}
            onPress={() => setFormData({ ...formData, type })}
          >
            <Text style={[styles.typeButtonText, formData.type === type && styles.selectedTypeButtonText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          isWeb && styles.scrollContentWeb,
          { paddingBottom: isWeb ? 40 : 90 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.form, isWeb && styles.formWeb]}>
          {/* Image Upload Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Vehicle Image</Text>
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={40} color="#9ca3af" />
                  <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Basic Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={[styles.inputRow, isWeb && styles.inputRowWeb]}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Make *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.make}
                  onChangeText={(text) => setFormData({ ...formData, make: text })}
                  placeholder="e.g., Toyota, Honda, BMW"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Model *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.model}
                  onChangeText={(text) => setFormData({ ...formData, model: text })}
                  placeholder="e.g., Camry, Civic, X5"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={[styles.inputRow, isWeb && styles.inputRowWeb]}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Year *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.year}
                  onChangeText={(text) => setFormData({ ...formData, year: text })}
                  placeholder="e.g., 2023"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Seats *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.seats}
                  onChangeText={(text) => setFormData({ ...formData, seats: text })}
                  placeholder="e.g., 5"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {renderTypeSelector()}
          </View>

          {/* Pricing & Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pricing & Details</Text>

            <View style={[styles.inputRow, isWeb && styles.inputRowWeb]}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Price per Day ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pricePerDay}
                  onChangeText={(text) => setFormData({ ...formData, pricePerDay: text })}
                  placeholder="e.g., 50.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Mileage</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mileage}
                  onChangeText={(text) => setFormData({ ...formData, mileage: text })}
                  placeholder="e.g., 25000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Additional details about the vehicle..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.label}>Available for Rent</Text>
              <Switch
                value={formData.available}
                onValueChange={(value) => setFormData({ ...formData, available: value })}
                trackColor={{ false: "#e5e7eb", true: "#222" }}
                thumbColor={formData.available ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Saving..." : isEditing ? "Update Vehicle" : "Add Vehicle"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#222',
  },
  headerSpacer: {
    width: 28,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  scrollContentWeb: {
    minHeight: "100vh",
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 40,
  },
  form: {
    paddingHorizontal: 16,
  },
  formWeb: {
    maxWidth: 800,
    width: "100%",
    paddingHorizontal: 40,
  },
  card: {
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
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: -0.5,
    color: '#222',
    marginBottom: 16,
  },
  imageUpload: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: "column",
    gap: 16,
  },
  inputRowWeb: {
    flexDirection: "row",
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeScrollView: {
    flexGrow: 0,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTypeButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
})