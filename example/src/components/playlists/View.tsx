import React, { useRef, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { v4 as uuidv4 } from 'uuid';
import { IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { styles } from '../style';
import { useNoxSetting } from '../../hooks/useSetting';
import { ViewEnum } from '../../enums/View';
import AddPlaylistButton from '../buttons/AddPlaylistButton';
import { STORAGE_KEYS } from '../../utils/ChromeStorage';
import NewPlaylistDialog from '../dialogs/NewPlaylistDialog';

export default (props: any) => {
  const navigation = useNavigation();
  const playlists = useNoxSetting(state => state.playlists);
  const playlistIds = useNoxSetting(state => state.playlistIds);
  // TODO: and how to property type this?
  const addPlaylistButtonRef = useRef<any>(null);
  const setCurrentPlaylist = useNoxSetting(state => state.setCurrentPlaylist);
  const removePlaylist = useNoxSetting(state => state.removePlaylist);
  // HACK: tried to make searchList draweritem button as addPlaylistButton, but
  // dialog disposes on textinput focus. created a dialog directly in this component
  // instead and works fine.
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = useState(false);

  const goToPlaylist = (playlistId: string) => {
    setCurrentPlaylist(playlists[playlistId]);
    navigation.navigate(ViewEnum.PLAYER_PLAYLIST as never);
  };

  const confirmOnDelete = (playlistId: string) => {
    Alert.alert(
      `Delete ${playlists[playlistId].title}?`,
      `Are you sure to delete playlist ${playlists[playlistId].title}?`,
      [
        {
          text: 'Cancel',
          onPress: () => void 0,
          style: 'cancel',
        },
        { text: 'OK', onPress: () => removePlaylist(playlistId) },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Divider></Divider>
      <DrawerItem
        label=""
        icon={() => <AddPlaylistButton ref={addPlaylistButtonRef} />}
        onPress={
          // HACK: tooo lazy to lift this state up...
          addPlaylistButtonRef.current
            ? () => addPlaylistButtonRef.current!.setOpen()
            : () => void 0
        }
      />
      <DrawerItem
        label={
          playlists[STORAGE_KEYS.SEARCH_PLAYLIST_KEY]
            ? playlists[STORAGE_KEYS.SEARCH_PLAYLIST_KEY].title
            : 'NAN'
        }
        onPress={() => goToPlaylist(STORAGE_KEYS.SEARCH_PLAYLIST_KEY)}
        key={uuidv4()}
        icon={() => (
          <IconButton
            icon="new-box"
            onPress={() => setNewPlaylistDialogOpen(true)}
            size={30}
            style={{ position: 'absolute', right: 10 }}
          />
        )}
      />
      <NewPlaylistDialog
        visible={newPlaylistDialogOpen}
        fromList={playlists[STORAGE_KEYS.SEARCH_PLAYLIST_KEY]}
        onClose={() => setNewPlaylistDialogOpen(false)}
        onSubmit={() => setNewPlaylistDialogOpen(false)}
      />
      {playlistIds.map(val => (
        <DrawerItem
          label={playlists[val].title}
          onPress={() => goToPlaylist(val)}
          icon={() => (
            <IconButton
              icon="close"
              onPress={() => confirmOnDelete(val)}
              size={25}
              style={{ position: 'absolute', right: 10 }}
            />
          )}
          key={uuidv4()}
          style={{}}
        />
      ))}
    </DrawerContentScrollView>
  );
};
