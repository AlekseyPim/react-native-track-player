import * as React from 'react';
import { Menu } from 'react-native-paper';
import { useNoxSetting } from '../../hooks/useSetting';
import { CopiedPlaylistMenuItem } from '../buttons/CopiedPlaylistButton';
import { RenameSongMenuItem } from '../buttons/RenameSongButton';

enum ICONS {
  SEND_TO = 'playlist-plus',
  COPY_SONG_NAME = '',
  COPY_SONG_URL = '',
  GOTO_BILIBILI = '',
  SEARCH_IN_PLAYLIST = '',
  RENAME = '',
  RELOAD = '',
  REMOVE = 'delete',
  REMOVE_AND_BAN_BVID = '',
}

interface props {
  checking?: boolean;
  checked?: boolean[];
  resetChecked?: () => void;
}

export default ({
  checking = false,
  checked = [],
  resetChecked = () => void 0,
}: props) => {
  const songMenuVisible = useNoxSetting(state => state.songMenuVisible);
  const setSongMenuVisible = useNoxSetting(state => state.setSongMenuVisible);
  const menuCoord = useNoxSetting(state => state.songMenuCoords);
  const songMenuSongIndexes = useNoxSetting(state => state.songMenuSongIndexes);
  const currentPlaylist = useNoxSetting(state => state.currentPlaylist);
  const updatePlaylist = useNoxSetting(state => state.updatePlaylist);

  const closeMenu = React.useCallback(() => setSongMenuVisible(false), []);

  const selectedSongIndexes = () => {
    if (checking) {
      const result = checked
        .map((val, index) => {
          if (val) {
            return index;
          }
        })
        .filter(val => val !== undefined);
      if (result.length > 0) {
        return result;
      }
    }
    return songMenuSongIndexes;
  };

  const selectedSongs = () => {
    return selectedSongIndexes().map(index => currentPlaylist.songList[index!]);
  };

  const selectedPlaylist = () => {
    const songs = selectedSongs();
    return {
      ...currentPlaylist,
      songList: songs,
      title: songs.length > 1 ? 'Selected songs' : songs[0].parsedName,
    };
  };

  const renameSong = (rename: string) => {
    // i sure hope this doesnt break anything...
    const song = currentPlaylist.songList[songMenuSongIndexes[0]];
    song.name = song.parsedName = rename;
    updatePlaylist(currentPlaylist, [], []);
  };

  return (
    <Menu visible={songMenuVisible} onDismiss={closeMenu} anchor={menuCoord}>
      <CopiedPlaylistMenuItem
        getFromListOnClick={selectedPlaylist}
        onSubmit={closeMenu}
      />
      <Menu.Item
        leadingIcon={ICONS.REMOVE}
        onPress={() => {
          // TODO: necessary to add an alert dialog?
          updatePlaylist(currentPlaylist, [], selectedSongs());
          setSongMenuVisible(false);
          resetChecked();
        }}
        title="Remove"
      />
      <RenameSongMenuItem
        getSongOnClick={() => selectedSongs()[0]}
        disabled={checking}
        onSubmit={renameSong}
      />
      <Menu.Item
        leadingIcon={ICONS.SEARCH_IN_PLAYLIST}
        onPress={closeMenu}
        title="Undo"
      />
      <Menu.Item leadingIcon={ICONS.RENAME} onPress={closeMenu} title="Undo" />
      <Menu.Item leadingIcon={ICONS.RELOAD} onPress={closeMenu} title="Undo" />
      <Menu.Item
        leadingIcon={ICONS.REMOVE_AND_BAN_BVID}
        onPress={closeMenu}
        title="Undo"
      />
    </Menu>
  );
};
