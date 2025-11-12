import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 애니메이션 값
  const titlePosition = useRef(new Animated.Value(0)).current;
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const inputTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    Animated.parallel([
      // 제목을 위로 이동
      Animated.timing(titlePosition, {
        toValue: -100,
        duration: 800,
        useNativeDriver: true,
      }),
      // 입력 필드 등장
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(inputOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(inputTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleLogin = () => {
    // 이메일이나 비밀번호가 입력되어 있으면 로그인 처리
    if (email.trim() || password.trim()) {
      router.replace('/home');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* 애니메이션되는 제목 부분 */}
        <Animated.View 
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: titlePosition }]
            }
          ]}
        >
          <Text style={styles.title}>IMReal</Text>
          <Text style={styles.subtitle}>딥페이크로부터 보호하세요</Text>
        </Animated.View>

        {/* 애니메이션되는 입력 필드 */}
        <Animated.View 
          style={[
            styles.inputContainer,
            {
              opacity: inputOpacity,
              transform: [{ translateY: inputTranslateY }]
            }
          ]}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="username@gmail.com"
              placeholderTextColor="#CCCCCC"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#CCCCCC"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 배경 자물쇠 이미지 */}
        <Image 
          source={require('../assets/images/logo2.png')}
          style={styles.lockImage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    position: 'absolute',
    top: '30%',
    paddingHorizontal: 40,
    zIndex: 10,
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
  inputContainer: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    paddingHorizontal: 30,
    zIndex: 10,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  loginButton: {
    backgroundColor: '#26C6DA',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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