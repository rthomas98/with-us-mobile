import React, { forwardRef, useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TextInputProps, 
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  isPassword?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  isPassword = false,
  fullWidth = true,
  style,
  textStyle,
  ...props
}, ref) => {
  const colorScheme = useColorScheme();
  const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  // Define colors based on theme
  const textColor = Colors[colorScheme ?? 'light'].text;
  const placeholderColor = Colors[colorScheme ?? 'light'].tabIconDefault;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const borderColor = isFocused 
    ? Colors[colorScheme ?? 'light'].tint 
    : error 
      ? '#FF3B30' 
      : Colors[colorScheme ?? 'light'].border;

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <Text style={[styles.label, { color: '#222720' }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        { 
          borderColor,
          backgroundColor
        },
        style
      ]}>
        <TextInput
          ref={ref}
          style={[
            styles.input, 
            { color: textColor },
            textStyle
          ]}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconButton}>
            <Feather 
              name={secureTextEntry ? 'eye' : 'eye-off'} 
              size={20} 
              color={placeholderColor} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  iconButton: {
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  }
});

export default Input;
