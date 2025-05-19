import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: number;
  namecategory: string;
}

interface CategoryPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  loading?: boolean;
  error?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label,
  value,
  onValueChange,
  categories,
  loading = false,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedCategory = categories.find(cat => cat.id.toString() === value);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onValueChange(item.id.toString());
        setModalVisible(false);
      }}
    >
      <Text style={styles.itemText}>{item.namecategory}</Text>
      {value === item.id.toString() && (
        <Ionicons name="checkmark" size={24} color="#A020F0" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {loading ? (
        <ActivityIndicator size={24} color="#A020F0" />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.pickerContainer, error && styles.errorBorder]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectedText}>
              {selectedCategory ? selectedCategory.namecategory : 'Sélectionnez une catégorie'}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#A020F0" />
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sélectionnez une catégorie</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={categories}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.list}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 12,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  errorBorder: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
}); 