import unittest
import spotipy
from spotipy.oauth2 import SpotifyOAuth

class TestSpotifyAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        client_id = 'your_client_id'
        client_secret = 'your_client_secret'
        cls.spotify = Spotify(client_credentials_manager=SpotifyClientCredentials(client_id, client_secret))

    def test_search_track(self):
        result = self.spotify.search(q='Never Gonna Give You Up', type='track')
        self.assertTrue(len(result['tracks']['items']) > 0)
        self.assertEqual(result['tracks']['items'][0]['name'], 'Never Gonna Give You Up')

    def test_get_artist(self):
        artist_id = '1uNFoZAHBGtllmzznpCI3s'  # Justin Bieber's artist ID
        result = self.spotify.artist(artist_id)
        self.assertEqual(result['name'], 'Justin Bieber')

if __name__ == '__main__':
    unittest.main()