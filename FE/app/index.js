import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Splash1() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/splash2');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

return (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={styles.logoImage}
      />
    </View>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 104,
    height: 104,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#4FC3F7',
    marginTop: 10,
  },
});