interface User {
    id: string;
    username: string;
    profilePicture: Image;
}

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

interface Moment {
    id: string;
    region: string;
}

interface TagUser {
    userId: string;
    user: User;
    searchText: string;
    endIndex: number;
    isUntagged: boolean;
    replaceText: string;
    type: string;
}

interface RealMojis {
    id: string;
    user: User;
    media: Image;
    type?: string;
    emoji: string;
    isInstant: boolean;
    postedAt: string;
}

interface PostType {
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

interface Location {
    latitude: number;
    longitude: number;
    ReverseGeocode?: ReverseGeocodeData;
}

interface ReverseGeocodeData {
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

interface UserPosts {
    [postId: string]: PostType[];
}

export interface FeedType {
    userPosts?: UserPosts;
    friendsPosts?: FriendPost[];
}

export interface FriendPost {
    user: User;
    momentId: string;
    region: string;
    moment: Moment;
    posts: PostType[];
}

export interface refreshDataType {
    token: string;
    refresh_token: string;
    token_expiration: string;
}