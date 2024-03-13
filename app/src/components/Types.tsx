interface Image {
    url: string;
    width: number;
    height: number;
    mediaType?: string;
}

interface User {
    id: string;
    username: string;
    profilePicture: Image;
}

export interface RealMojis {
    id: string;
    user: User;
    media: Image;
    type?: string;
    emoji: string;
    isInstant: boolean;
    postedAt: string;
}

interface FOFRealMojis {
    total: number;
    sample: RealMojis[];
}

interface Location {
    latitude: number;
    longitude: number;
    ReverseGeocode?: ReverseGeocodeData;
}

export interface TagUser {
    userId: string;
    user: User;
    searchText: string;
    endIndex: number;
    isUntagged: boolean;
    replaceText: string;
    type: string;
}

interface Comment {
    id: string;
    user: User;
    content: string;
    postedAt: string;
}

export interface PostType {
    id: string;
    primary: Image;
    secondary: Image;
    retakeCounter: number;
    lateInSeconds: number;
    isLate: boolean;
    isMain: boolean;
    takenAt: string;
    postedAt: string;
    realMojis: RealMojis[];
    comments: Comment[];
    caption: string;
    tags: TagUser[];
    creationDate: string;
    updatedAt: string;
    visibility: string[];
    origin: any;
    postType: string;
    location?: Location;
}

interface PostOfSelectedPost {
    id: string;
    primary: Image;
    secondary: Image;
    retakeCounter?: number;
    lateInSeconds: number;
    isLate?: boolean;
    isMain?: boolean;
    takenAt: string;
    postedAt: string;
    realMojis?: RealMojis[];
    comments?: Comment[];
    caption: string;
    tags: TagUser[];
    creationDate?: string;
    updatedAt?: string;
    visibility?: string[];
    origin?: any;
    postType?: string;
    location?: Location;
}

export interface SelectedPost {
    user?: User;
    post?: PostOfSelectedPost;
    realMojis?: RealMojis[];
}

interface Moment {
    id: string;
    region: string;
}

export interface FriendPost {
    user: User;
    momentId: string;
    region: string;
    moment: Moment;
    posts: PostType[];
}

export interface UserPosts {
    [postId: string]: PostType[];
}

interface pageData {
    scrollY: number;
    gridView: boolean;
}

export interface FeedType {
    userPosts?: UserPosts;
    friendsPosts?: FriendPost[];
    data?: pageData
}

interface Tag {
    userId: string;
    user: User;
    searchText: string;
    endIndex: number;
    isUntagged: boolean;
    replaceText: string;
    type: string;
}

export interface TagsResponse {
    tags: Tag[];
}

export interface FOFPost {
    id: string;
    user: User;
    moment: Moment;
    primary: Image;
    secondary: Image;
    caption: string;
    takenAt: string;
    postedAt: string;
    lateInSeconds: number;
    realmojis: FOFRealMojis;
    location?: Location;
    tags: TagUser[];
}

export interface FOFfeedType {
    data?: FOFPost[];
    params?: pageData;
}

export interface ProfileData {
    data: UserData;
    pinnedMemories?: PinnedMemory[];
}

interface UserData {
    id: string;
    username: string;
    birthdate: string;
    fullname: string;
    profilePicture: Image;
    realmojis: RealMojis[];
    devices: Device[];
    canDeletePost: boolean;
    canPost: boolean;
    canUpdateRegion: boolean;
    phoneNumber: string;
    countryCode: string;
    region: string;
    createdAt: string;
    isRealPeople: boolean;
    userFreshness: string;
    streakLength: number;
    type: string;
}

interface Device {
    language: string;
    timezone: string;
}

export interface ReverseGeocodeData {
    Match_addr: string;
    LongLabel: string;
    ShortLabel: string;
    Addr_type: string;
    Type: string;
    PlaceName: string;
    AddNum: string;
    Address: string;
    Block: string;
    Sector: string;
    Neighborhood: string;
    District: string;
    City: string;
    MetroArea: string;
    Subregion: string;
    Region: string;
    RegionAbbr: string;
    Territory: string;
    Postal: string;
    PostalExt: string;
    CntryName: string;
    CountryCode: string;
}

export interface PostProps {
    post: {
        primary: Image;
        secondary: Image;
        location?: Location;
    };
    width: string;
    swipeable: boolean;
    setSwipeable: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StyleObject {
    [key: string]: {
        primary: string;
        secondary: string;
        primaryRatio: number;
        secondaryRatio: number;
    };
}

export interface Index {
    [key: string]: number;
}

interface PinnedMemory {
    id: string;
    primary: Image;
    secondary: Image;
    takenAt: string;
    memoryDay: string;
    isLate: boolean;
    isMain: boolean;
    momentId: string;
}

export interface token {
    token: string;
    refresh_token: string;
    token_expiration: string;
    userId: string;
}

export interface refreshData {
    token: string;
    refresh_token: string;
    token_expiration: string;
}

export interface FeedResponse {
    data: FeedType
}

export interface OptionsMenu {
    show: boolean;
    username?: string;
    disabled: boolean;
    takenAt?: string;
    primary?: string;
    secondary?: string;
}