import { useCallback } from 'react';
import {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  WithTimingConfig,
  WithSpringConfig,
} from 'react-native-reanimated';

// Default animation configs
const DEFAULT_TIMING_CONFIG: WithTimingConfig = {
  duration: 300,
};

const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 10,
  stiffness: 100,
};

/**
 * Hook to create a simple toggle animation with proper Reanimated usage
 * @param initialValue Initial value of the animation (0 or 1)
 * @param timingConfig Optional timing configuration
 * @returns Animation controls and animated style
 */
export const useToggleAnimation = (
  initialValue: number = 0,
  timingConfig: WithTimingConfig = DEFAULT_TIMING_CONFIG
) => {
  // Create a shared value for the animation
  const animationValue = useSharedValue(initialValue);

  // Toggle function that properly animates the shared value
  const toggle = useCallback((toValue?: number) => {
    // If toValue is provided, use it, otherwise toggle between 0 and 1
    const nextValue = toValue !== undefined 
      ? toValue 
      : animationValue.value === 0 ? 1 : 0;
    
    // Animate to the next value
    animationValue.value = withTiming(nextValue, timingConfig);
  }, [animationValue, timingConfig]);

  // Set value function that properly animates the shared value
  const setValue = useCallback((value: number) => {
    animationValue.value = withTiming(value, timingConfig);
  }, [animationValue, timingConfig]);

  return {
    animationValue,
    toggle,
    setValue,
  };
};

/**
 * Hook to create a rotation animation with proper Reanimated usage
 * @param initialValue Initial rotation value in degrees
 * @param springConfig Optional spring configuration
 * @returns Animation controls and animated style
 */
export const useRotationAnimation = (
  initialValue: number = 0,
  springConfig: WithSpringConfig = DEFAULT_SPRING_CONFIG
) => {
  // Create a shared value for the rotation
  const rotation = useSharedValue(initialValue);

  // Rotate function that properly animates the shared value
  const rotate = useCallback((toValue: number) => {
    rotation.value = withSpring(toValue, springConfig);
  }, [rotation, springConfig]);

  // Create an animated style that uses the shared value properly
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return {
    rotation,
    rotate,
    animatedStyle,
  };
};

/**
 * Hook to create a fade animation with proper Reanimated usage
 * @param initialValue Initial opacity value (0-1)
 * @param timingConfig Optional timing configuration
 * @returns Animation controls and animated style
 */
export const useFadeAnimation = (
  initialValue: number = 0,
  timingConfig: WithTimingConfig = DEFAULT_TIMING_CONFIG
) => {
  // Create a shared value for the opacity
  const opacity = useSharedValue(initialValue);

  // Fade function that properly animates the shared value
  const fade = useCallback((toValue: number) => {
    opacity.value = withTiming(toValue, timingConfig);
  }, [opacity, timingConfig]);

  // Create an animated style that uses the shared value properly
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return {
    opacity,
    fade,
    animatedStyle,
  };
};
