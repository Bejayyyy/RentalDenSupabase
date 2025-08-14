import React, { useState } from 'react';
import { View, TextInput, Text, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { serverTimestamp } from 'firebase/firestore';

export default function CarForm({ onSubmit, initialValues, submitLabel }) {
  const [name, setName] = useState(initialValues?.name || '');
  const [seats, setSeats] = useState(initialValues?.seats ? String(initialValues.seats) : '');
  const [availability, setAvailability] = useState(initialValues?.availability ?? true);
  const [image, setImage] = useState(initialValues?.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [webPickerError, setWebPickerError] = useState('');

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Web: Use input element for file selection
      setWebPickerError('Image picker is limited on web. Please use a supported browser.');
      // Optionally, you can implement a custom file input for web here
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `cars/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    setUploading(false);
    return url;
  };

  const handleSubmit = async () => {
    let imageUrl = initialValues?.imageUrl || '';
    if (image && image !== initialValues?.imageUrl) {
      imageUrl = await uploadImageAsync(image);
    }
    const carData = {
      name,
      seats: parseInt(seats, 10),
      availability,
      imageUrl,
      createdAt: initialValues?.createdAt || serverTimestamp(),
    };
    await onSubmit(carData);
  };

  return (
    <View className="gap-4 w-full max-w-lg mx-auto">
      <TextInput
        placeholder="Car Name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-1 w-full"
      />
      <TextInput
        placeholder="Number of Seats"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-1 w-full"
      />
      <TouchableOpacity onPress={() => setAvailability(!availability)} className="mb-2">
        <Text className={`font-semibold ${availability ? 'text-green-600' : 'text-red-500'}`}>Availability: {availability ? 'Available' : 'Not Available'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} className="items-center mb-2">
        {image ? (
          <Image source={{ uri: image }} className="w-32 h-24 rounded-lg mb-2" />
        ) : (
          <View className="w-32 h-24 bg-gray-100 rounded-lg items-center justify-center">
            <Text className="text-gray-400">Select Car Image</Text>
          </View>
        )}
      </TouchableOpacity>
      {webPickerError && Platform.OS === 'web' && (
        <Text className="text-red-500 text-xs text-center mb-2">{webPickerError}</Text>
      )}
      {uploading && <ActivityIndicator size="small" color="#0000ff" />}
      <TouchableOpacity onPress={handleSubmit} disabled={uploading} className="bg-black rounded-xl py-3 mt-2">
        <Text className="text-white text-center font-bold text-base">{submitLabel || 'Save Car'}</Text>
      </TouchableOpacity>
    </View>
  );
}
