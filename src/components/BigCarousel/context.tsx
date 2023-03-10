import React from 'react';

type SlideData = {
  id: string;
  width: number;
};
type BigCarouselContext = {
  slides: SlideData[];
  addSlide: (slide: SlideData) => void;
  removeSlide: (id: string) => void;
};
const Context = React.createContext<BigCarouselContext>({
  slides: [],
  addSlide: () => {},
  removeSlide: () => {},
});

Context.displayName = 'BigCarouselContext';

export const BigCarouselProvider = ({ children }: { children: React.ReactNode }) => {
  const [slides, setSlides] = React.useState<SlideData[]>([]);
  const addSlide = React.useCallback((slide: SlideData) => {
    setSlides((prevSlides) => [...prevSlides, slide]);
  }, []);

  const removeSlide = React.useCallback((id: string) => {
    setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
  }, []);

  return (
    <Context.Provider value={{ slides, addSlide, removeSlide }}>{children}</Context.Provider>
  );
};

export const useBigCarousel = () => React.useContext(Context);
