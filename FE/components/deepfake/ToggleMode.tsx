import React from 'react';
import { View, Image, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useRouter, type Href } from 'expo-router';

type Mode = 'single' | 'group';

interface ToggleModeProps {
  active: Mode;
  routes: { single: Href; group: Href };  // ← string → Href로 변경
  style?: ViewStyle;
}

const icons = {
  single: {
    active: require('../../assets/images/toggles/single-active.png'),
    inactive: require('../../assets/images/toggles/single-inactive.png'),
  },
  group: {
    active: require('../../assets/images/toggles/group-active.png'),
    inactive: require('../../assets/images/toggles/group-inactive.png'),
  },
};

export const ToggleMode: React.FC<ToggleModeProps> = ({ active, routes, style }) => {
  const router = useRouter();

  const goSingle = () => {
    if (active !== 'single') router.replace(routes.single);
  };
  const goGroup = () => {
    if (active !== 'group') router.replace(routes.group);
  };

  return (
    <View style={[styles.card, style]}>
      <Pressable onPress={goSingle} style={styles.btn} hitSlop={6}>
        <Image
          source={active === 'single' ? icons.single.active : icons.single.inactive}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>

      <Pressable onPress={goGroup} style={styles.btn} hitSlop={6}>
        <Image
          source={active === 'group' ? icons.group.active : icons.group.inactive}
          style={styles.icon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,  
    paddingVertical: 8,     
    gap: 8,                
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.20,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12,
  },
  btn: { padding: 0 },      // 2 → 0 (불필요 여백 제거)
  icon: { width: 50, height: 50 }, // 64 → 40 (아이콘 자체 축소)
});

