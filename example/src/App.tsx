import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSetupPlayer, Player } from './components/player/View';
import Playlist from './components/playlist/View';
import { styles } from './components/style';
import { IconButton } from 'react-native-paper';
import PlayerBottomPanel from './components/player/PlayerProgressControls';
import { useNoxSetting } from './hooks/useSetting';
import { initPlayerObject } from './utils/ChromeStorage';
import PlaylistDrawer from './components/playlists/View';
import { ViewEnum } from './enums/View';
import Settings from './components/setting/View';

const App: React.FC = () => {
  const isPlayerReady = useSetupPlayer();
  const Drawer = createDrawerNavigator();
  const Tab = createMaterialTopTabNavigator();
  const initPlayer = useNoxSetting(state => state.initPlayer);

  function Player() {
    return (
      <React.Fragment>
        <Tab.Navigator>
          <Tab.Screen
            name={ViewEnum.PLAYER_COVER}
            component={Player}
            options={{ tabBarStyle: { display: 'none' } }}
          />
          <Tab.Screen
            name={ViewEnum.PLAYER_PLAYLIST}
            component={Playlist}
            options={{ tabBarStyle: { display: 'none' } }}
          />
        </Tab.Navigator>
        <PlayerBottomPanel />
      </React.Fragment>
    );
  }

  useEffect(() => {
    async function initializePlayer() {
      await initPlayer(await initPlayerObject());
    }

    function deepLinkHandler(data: { url: string }) {
      console.log('deepLinkHandler', data.url);
    }

    initializePlayer();

    // This event will be fired when the app is already open and the notification is clicked
    const subscription = Linking.addEventListener('url', deepLinkHandler);

    // When you launch the closed app from the notification or any other link
    Linking.getInitialURL().then(url => console.log('getInitialURL', url));

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" drawerContent={PlaylistDrawer}>
        <Drawer.Screen
          name={ViewEnum.PLAYER_HOME}
          component={Player}
          options={{
            header: () => null,
            drawerIcon: () => <IconButton icon="home-outline" />,
          }}
        />
        <Drawer.Screen
          name={ViewEnum.LEFT_DRAWER}
          options={{ drawerIcon: () => <IconButton icon="cog" /> }}
          component={Settings}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
