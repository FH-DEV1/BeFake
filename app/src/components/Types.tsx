interface Image {
    url: string;
    width: number;
    height: number;
}

interface User {
    id: string;
    username: string;
    profilePicture: Image;
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

interface FOFRealMojis {
    total: number;
    sample: RealMojis[];
}

interface Location {
    latitude: number;
    longitude: number;
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

interface Comment {
    id: string;
    user: User;
    content: string;
    postedAt: string;
}

export interface Post {
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
    from?: string;
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
    posts: Post[];
}

interface UserPosts {
    [postId: string]: Post[];
}

export interface FeedType {
    userPosts?: UserPosts;
    friendsPosts?: FriendPost[];
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

interface FOFPost {
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
}

export interface ProfileData {
    status: number;
    message: string;
    data: UserData;
}

interface UserData {
    id: string;
    username: string;
    birthdate: string;
    fullname: string;
    profilePicture: {
        url: string;
        width: number;
        height: number;
    };
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
    [postId: string]: string;
}
