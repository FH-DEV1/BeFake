import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { FOFfeedType, FeedType, SelectedPost } from "./Types";

interface IPageContext {
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
  gridView: boolean;
  setGridView: Dispatch<SetStateAction<boolean>>;
  prevPage: string;
  setPrevPage: Dispatch<SetStateAction<string>>;
  scrollPos: number;
  setScrollPos: Dispatch<SetStateAction<number>>;
  feed: FeedType;
  setFeed: Dispatch<SetStateAction<FeedType>>;
  FOFfeed: FOFfeedType;
  setFOFFeed: Dispatch<SetStateAction<FOFfeedType>>;
  selectedPost: SelectedPost;
  setSelectedPost: Dispatch<SetStateAction<SelectedPost>>;
}

const PageContext = createContext<IPageContext>({
  page: "",
  setPage: () => {},
  gridView: false,
  setGridView: () => {},
  prevPage: "",
  setPrevPage: () => {},
  scrollPos: 0,
  setScrollPos: () => {},
  feed: {},
  setFeed: () => {},
  FOFfeed: {},
  setFOFFeed: () => {},
  selectedPost: {},
  setSelectedPost: () => {},
});

interface IProps {
  children: ReactNode;
}

export function PageProvider({ children }: IProps) {
  const [page, setPage] = useState("start");
  const [gridView, setGridView] = useState(false);
  const [prevPage, setPrevPage] = useState("start");
  const [scrollPos, setScrollPos] = useState(0);
  const [feed, setFeed] = useState({});
  const [FOFfeed, setFOFFeed] = useState({});
  const [selectedPost, setSelectedPost] = useState({})

  return (
    <PageContext.Provider value={{ page, setPage, gridView, setGridView, prevPage, setPrevPage, scrollPos, setScrollPos, feed, setFeed, FOFfeed, setFOFFeed, selectedPost, setSelectedPost }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageState() {
  return useContext(PageContext);
}
