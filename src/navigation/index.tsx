import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import { Home } from './screens/Home';
import { ReportsScreen } from './screens/Dashboard';
import { NotFound } from './screens/NotFound';

const HomeTabs = createBottomTabNavigator({
  screens: {

    Ana_Sayfa: {
      screen: Home,
      options: {
        title: 'Ana Sayfa',
        tabBarIcon: ({ color, size }) => (
          <Image
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
      Raporlar: {
      screen: ReportsScreen,
      options: {
          title: 'Raporlar',
        tabBarIcon: ({ color, size }) => (
          <Image
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
