import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import { Formik } from 'formik';

// Colors
const black = '#000000';
const white = '#FFFFFF';
const lightGray = '#F5F5F5';
const mediumGray = '#D3D3D3';
const darkGray = '#666666';
const errorRed = '#FF3B30';

// Mock customer data (would come from Shopify API in a real app)
const mockCustomerData = {
  firstName: 'Cody',
  lastName: 'Fisher',
  email: 'cody.fisher45@example.com',
  dateOfBirth: '1990-07-12',
  gender: 'Male',
  phoneNumber: '+1 234 453 231 506',
  countryCode: 'US'
};

// Validation schema
const ProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  dateOfBirth: Yup.string()
    .required('Date of birth is required'),
  gender: Yup.string()
    .required('Gender is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
});

// Gender options
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

// Country codes for phone
const countryCodes = [
  { code: 'US', flag: '', dial: '+1' },
  { code: 'GB', flag: '', dial: '+44' },
  { code: 'CA', flag: '', dial: '+1' },
  { code: 'AU', flag: '', dial: '+61' },
];

export default function MyDetailsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Parse date from display format to ISO
  const parseDate = (displayDate: string) => {
    const parts = displayDate.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  // Load customer data
  // In a real app, this would be a call to the Shopify API
  // For example:
  // const fetchCustomerData = async () => {
  //   try {
  //     const response = await fetch('https://your-shopify-store.myshopify.com/api/2023-07/graphql.json', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Shopify-Storefront-Access-Token': 'your-storefront-access-token'
  //       },
  //       body: JSON.stringify({
  //         query: `
  //           query {
  //             customer(customerAccessToken: "customer-access-token") {
  //               firstName
  //               lastName
  //               email
  //               phone
  //               # Other customer fields
  //             }
  //           }
  //         `
  //       })
  //     });
  //     const data = await response.json();
  //     // Process customer data
  //   } catch (error) {
  //     console.error('Error fetching customer data:', error);
  //   }
  // };
  
  // Simulate API call
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setSaving(true);
    
    // In a real app, this would update the customer data in Shopify
    // For example:
    // try {
    //   const response = await fetch('https://your-shopify-store.myshopify.com/api/2023-07/graphql.json', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-Shopify-Storefront-Access-Token': 'your-storefront-access-token'
    //     },
    //     body: JSON.stringify({
    //       query: `
    //         mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    //           customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
    //             customer {
    //               id
    //               firstName
    //               lastName
    //               email
    //             }
    //             customerUserErrors {
    //               code
    //               field
    //               message
    //             }
    //           }
    //         }
    //       `,
    //       variables: {
    //         customerAccessToken: "customer-access-token",
    //         customer: {
    //           firstName: values.fullName.split(' ')[0],
    //           lastName: values.fullName.split(' ').slice(1).join(' '),
    //           email: values.email,
    //           phone: values.phoneNumber,
    //           // Other fields
    //         }
    //       }
    //     })
    //   });
    //   const data = await response.json();
    //   // Handle response
    // } catch (error) {
    //   console.error('Error updating customer data:', error);
    // }
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "Success",
        "Your details have been updated successfully.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }, 1500);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={black} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Details</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={black} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{
              fullName: `${mockCustomerData.firstName} ${mockCustomerData.lastName}`,
              email: mockCustomerData.email,
              dateOfBirth: formatDate(mockCustomerData.dateOfBirth),
              gender: mockCustomerData.gender,
              phoneNumber: mockCustomerData.phoneNumber.split(' ').slice(1).join(' ')
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                {/* Full Name */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.fullName && errors.fullName && styles.inputError
                    ]}
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    placeholder="Enter your full name"
                  />
                  {touched.fullName && errors.fullName && (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  )}
                </View>

                {/* Email Address */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={[
                      styles.input,
                      touched.email && errors.email && styles.inputError
                    ]}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Date of Birth */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.dateInput,
                      touched.dateOfBirth && errors.dateOfBirth && styles.inputError
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {values.dateOfBirth || 'Select date of birth'}
                    </Text>
                    <Ionicons name="calendar-outline" size={24} color={darkGray} />
                  </TouchableOpacity>
                  {touched.dateOfBirth && errors.dateOfBirth && (
                    <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={values.dateOfBirth ? new Date(parseDate(values.dateOfBirth)) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue('dateOfBirth', formatDate(selectedDate.toISOString()));
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                {/* Gender */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.selectInput,
                      touched.gender && errors.gender && styles.inputError
                    ]}
                    onPress={() => setShowGenderPicker(!showGenderPicker)}
                  >
                    <Text style={styles.selectText}>
                      {values.gender || 'Select gender'}
                    </Text>
                    <Ionicons 
                      name={showGenderPicker ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={darkGray} 
                    />
                  </TouchableOpacity>
                  {touched.gender && errors.gender && (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  )}
                  
                  {showGenderPicker && (
                    <View style={styles.optionsContainer}>
                      {genderOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionItem,
                            values.gender === option && styles.selectedOption
                          ]}
                          onPress={() => {
                            setFieldValue('gender', option);
                            setShowGenderPicker(false);
                          }}
                        >
                          <Text style={[
                            styles.optionText,
                            values.gender === option && styles.selectedOptionText
                          ]}>
                            {option}
                          </Text>
                          {values.gender === option && (
                            <Ionicons name="checkmark" size={20} color={black} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Phone Number */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.phoneInputContainer}>
                    <TouchableOpacity
                      style={styles.countryCodeButton}
                      onPress={() => setShowCountryPicker(!showCountryPicker)}
                    >
                      <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                      <Ionicons name="chevron-down" size={16} color={darkGray} />
                    </TouchableOpacity>
                    
                    <TextInput
                      style={[
                        styles.phoneInput,
                        touched.phoneNumber && errors.phoneNumber && styles.inputError
                      ]}
                      value={values.phoneNumber}
                      onChangeText={handleChange('phoneNumber')}
                      onBlur={handleBlur('phoneNumber')}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                    />
                  </View>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}
                  
                  {showCountryPicker && (
                    <View style={styles.countryOptionsContainer}>
                      {countryCodes.map((country) => (
                        <TouchableOpacity
                          key={country.code}
                          style={[
                            styles.countryOption,
                            selectedCountry.code === country.code && styles.selectedOption
                          ]}
                          onPress={() => {
                            setSelectedCountry(country);
                            setShowCountryPicker(false);
                          }}
                        >
                          <Text style={styles.countryFlag}>{country.flag}</Text>
                          <Text style={styles.countryDialCode}>{country.dial}</Text>
                          {selectedCountry.code === country.code && (
                            <Ionicons name="checkmark" size={20} color={black} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit as any}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: black,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  form: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: black,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: mediumGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: black,
    backgroundColor: white,
  },
  inputError: {
    borderColor: errorRed,
  },
  errorText: {
    color: errorRed,
    fontSize: 12,
    marginTop: 4,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: black,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: black,
  },
  optionsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: mediumGray,
    borderRadius: 8,
    backgroundColor: white,
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  selectedOption: {
    backgroundColor: lightGray,
  },
  optionText: {
    fontSize: 16,
    color: black,
  },
  selectedOptionText: {
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: mediumGray,
    borderRadius: 8,
    backgroundColor: white,
    marginRight: 8,
    width: 60,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: mediumGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: black,
    backgroundColor: white,
  },
  countryOptionsContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    width: 120,
    borderWidth: 1,
    borderColor: mediumGray,
    borderRadius: 8,
    backgroundColor: white,
    zIndex: 1000,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
  },
  countryDialCode: {
    fontSize: 14,
    color: black,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: black,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
  },
});
