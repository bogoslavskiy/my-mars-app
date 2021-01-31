import * as React from 'react';
import { RoverPhoto } from '../api/types';

type FavoritesPhotoContextType = {
  photos: RoverPhoto[];
  likePhoto: (photo: RoverPhoto) => void;
  undoLikePhoto: (id: number) => void;
}

const FavoritesPhotoContext = React.createContext<FavoritesPhotoContextType>({
  photos: [],
  likePhoto: () => {},
  undoLikePhoto: () => {}
});

export const FavoritesPhotoProvider: React.FC = ({ children }) => {
  const [photos, setPhotos] = React.useState<RoverPhoto[]>([]);

  const likePhoto = React.useCallback((photo: RoverPhoto) => {
    setPhotos((existing) => [...existing, photo]);
  }, []);

  const undoLikePhoto = React.useCallback((id: number) => {
    setPhotos((existing) => {
      console.log(existing, id);
      return existing.filter((item) => item.id !== id)
    });
  }, []);

  return (
    <FavoritesPhotoContext.Provider value={{ photos, likePhoto, undoLikePhoto }}>
      {children}
    </FavoritesPhotoContext.Provider>
  );
};  

export const useFavoritesPhoto = () => React.useContext(FavoritesPhotoContext);