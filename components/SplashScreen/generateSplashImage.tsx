import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { ThemedText } from '../ThemedText';

// Import SVG assets as strings
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// SVG file paths
const LINKS_SVG_PATH = '../../assets/images/links.svg';
const LOGO_SVG_PATH = '../../assets/images/w-logo.svg';

interface GenerateSplashImageProps {
  onCapture: (uri: string) => void;
  mode?: 'light' | 'dark';
}

interface GenerateSplashImageState {
  linksXml: string;
  logoXml: string;
  assetsLoaded: boolean;
}

class GenerateSplashImage extends React.Component<GenerateSplashImageProps, GenerateSplashImageState> {
  viewShotRef = React.createRef<ViewShot>();
  
  state: GenerateSplashImageState = {
    linksXml: '',
    logoXml: '',
    assetsLoaded: false
  };

  async componentDidMount() {
    try {
      // Load the SVG files
      const linksAsset = Asset.fromModule(require(LINKS_SVG_PATH));
      const logoAsset = Asset.fromModule(require(LOGO_SVG_PATH));
      
      await Promise.all([linksAsset.downloadAsync(), logoAsset.downloadAsync()]);
      
      // Read the SVG files as text
      const linksContent = await FileSystem.readAsStringAsync(linksAsset.localUri || '');
      const logoContent = await FileSystem.readAsStringAsync(logoAsset.localUri || '');
      
      this.setState({ 
        linksXml: linksContent, 
        logoXml: logoContent,
        assetsLoaded: true
      }, this.captureImage);
    } catch (error) {
      console.error('Error loading SVG assets:', error);
      // Fallback to direct require if the above method fails
      try {
        this.setState({ 
          linksXml: require(LINKS_SVG_PATH), 
          logoXml: require(LOGO_SVG_PATH),
          assetsLoaded: true
        }, this.captureImage);
      } catch (e) {
        console.error('Fallback loading failed:', e);
      }
    }
  }

  captureImage = async () => {
    if (this.state.assetsLoaded && this.viewShotRef.current) {
      try {
        // Using captureRef as a safer alternative that handles null checks
        const uri = await captureRef(this.viewShotRef);
        this.props.onCapture(uri);
      } catch (error) {
        console.error('Error capturing splash image:', error);
      }
    }
  };

  render() {
    const { mode = 'light' } = this.props;
    const isDarkMode = mode === 'dark';
    const backgroundColor = isDarkMode ? '#222720' : '#ffffff';
    
    if (!this.state.assetsLoaded) {
      return (
        <View style={[styles.container, { backgroundColor }]} />
      );
    }

    return (
      <ViewShot ref={this.viewShotRef} options={{ format: 'png', quality: 1 }}>
        <View style={[styles.container, { backgroundColor }]}>
          {/* Background pattern using links.svg */}
          <View style={styles.backgroundPattern}>
            <SvgXml xml={this.state.linksXml} width={width * 1.2} height={height * 1.2} />
          </View>
          
          {/* Centered logo */}
          <View style={styles.logoContainer}>
            <SvgXml xml={this.state.logoXml} width={200} height={200} />
            
            {/* Brand name */}
            <View style={{ marginTop: 20 }}>
              <ThemedText style={styles.brandText} lightColor="#222720" darkColor="#ffffff">
                WITH US
              </ThemedText>
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
    top: -50,
    left: -50,
    opacity: 0.15, // Subtle background
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default GenerateSplashImage;
