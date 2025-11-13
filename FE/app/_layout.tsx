// FE/app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';  // ✅ 이 줄 추가

export default function Layout() {
  return (
    // ✅ AuthProvider로 감싸주기
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </AuthProvider>
  );
}