import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Splash2() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>IMReal</Text>
        <Text style={styles.subtitle}>딥페이크로부터 보호하세요</Text>
      </View>
      <Image 
        source={require('../assets/images/logo2.png')}
        style={styles.lockImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    position: 'absolute',  // absolute로 변경
    top: '30%',  // 위에서 30% 위치
    paddingHorizontal: 40,
    zIndex: 10,  // 자물쇠보다 위에
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '400',
  },
  lockImage: {
    position: 'absolute',
    bottom: 0,
    left: -40,
    width: 300,  
    height: 482, 
    resizeMode: 'contain',
  },
});