import React, { forwardRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';

// Import brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

// Use forwardRef to forward refs to the TouchableOpacity component
const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(({
  label,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  ...props
}, ref) => {
  // Determine button styles based on variant
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: heavyMetal,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: zorba,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: heavyMetal,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: heavyMetal,
          borderWidth: 0,
        };
    }
  };

  // Determine text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return white;
      case 'outline':
      case 'text':
        return heavyMetal;
      default:
        return white;
    }
  };

  // Determine button size
  const getButtonSize = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  // Determine text size
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'medium':
        return {
          fontSize: 16,
        };
      case 'large':
        return {
          fontSize: 18,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  // Combined styles
  const buttonStyles = [
    styles.button,
    getButtonStyle(),
    getButtonSize(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    getTextSize(),
    { color: getTextColor() },
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      ref={ref}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </TouchableOpacity>
  );
});

// Add display name for better debugging
Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
