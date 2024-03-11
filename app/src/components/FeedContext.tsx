"use client"
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
  } from "react";
import { FOFfeedType, FeedType } from "./Types";
  
  interface IFeedContext {
    feed: FeedType;
    setFeed: Dispatch<SetStateAction<FeedType>>;
    fof: FOFfeedType;
    setfof: Dispatch<SetStateAction<FOFfeedType>>;
  }
  
  const FeedContext = createContext<IFeedContext>({
    feed: {},
    setFeed: () => {},
    fof: {},
    setfof: () => {},
  });
  
  interface IProps {
    children: ReactNode;
  }
  
  export function FeedProvider({ children }: IProps) {
    const [feed, setFeed] = useState({});
    const [fof, setfof] = useState({});
  
    return (
      <FeedContext.Provider
        value={{ 
            feed, 
            setFeed,
            fof,
            setfof,
        }}
      >
        {children}
      </FeedContext.Provider>
    );
  }
  
  export function useFeedState() {
    return useContext(FeedContext);
  }