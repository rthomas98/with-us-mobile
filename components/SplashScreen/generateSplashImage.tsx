import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { ThemedText } from '../ThemedText';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Brand colors
const zorba = '#A59D94';
const white = '#ffffff';
const heavyMetal = '#222720';
const dawn = '#A9A39A';

interface GenerateSplashImageProps {
  onCapture: (uri: string) => void;
  mode?: 'light' | 'dark';
}

class GenerateSplashImage extends React.Component<GenerateSplashImageProps> {
  viewShotRef = React.createRef<ViewShot>();
  
  componentDidMount() {
    // Capture the image after a short delay to ensure rendering is complete
    setTimeout(() => {
      this.captureImage();
    }, 100);
  }
  
  captureImage = async () => {
    if (this.viewShotRef.current) {
      try {
        const uri = await captureRef(this.viewShotRef.current, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });
        
        this.props.onCapture(uri);
      } catch (error) {
        console.error('Error capturing splash image:', error);
      }
    }
  };
  
  render() {
    const { mode = 'light' } = this.props;
    const isDarkMode = mode === 'dark';
    const backgroundColor = isDarkMode ? heavyMetal : white;
    
    return (
      <ViewShot ref={this.viewShotRef} style={styles.container}>
        <View style={[styles.container, { backgroundColor }]}>
          {/* Background pattern */}
          <View style={styles.backgroundPattern}>
            <Image 
              source={require('../../assets/images/links.png')} 
              style={styles.patternImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Centered logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/w-logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            
            {/* Brand name */}
            <View style={styles.textContainer}>
              <ThemedText style={styles.brandText}>WITH US</ThemedText>
            </View>
          </View>
        </View>
      </ViewShot>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.05,
  },
  patternImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    marginTop: 20,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: heavyMetal,
  },
});

export default GenerateSplashImage;
