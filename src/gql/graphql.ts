/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Channel = {
  __typename?: 'Channel';
  /** create time */
  createAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  members?: Maybe<Array<Maybe<Member>>>;
  name?: Maybe<Scalars['String']['output']>;
  type: ChannelType;
  /** update time */
  updateAt: Scalars['String']['output'];
};

/** Defines the types of Channel */
export enum ChannelType {
  Audio = 'AUDIO',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type CreateProfileInput = {
  email: Scalars['String']['input'];
  imageUrl: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateServerInput = {
  name: Scalars['String']['input'];
  profileId: Scalars['Int']['input'];
};

export type Member = {
  __typename?: 'Member';
  /** create time */
  createAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  profile: Profile;
  profileId: Scalars['Float']['output'];
  role: MemberRole;
  server?: Maybe<Server>;
  /** update time */
  updateAt: Scalars['String']['output'];
};

/** Defines the types of Member on a server */
export enum MemberRole {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  Moderator = 'MODERATOR'
}

export type Mutation = {
  __typename?: 'Mutation';
  createProfile: Profile;
  createServer: Server;
};


export type MutationCreateProfileArgs = {
  profile: CreateProfileInput;
};


export type MutationCreateServerArgs = {
  file?: InputMaybe<Scalars['Upload']['input']>;
  server: CreateServerInput;
};

export type Profile = {
  __typename?: 'Profile';
  channels?: Maybe<Array<Maybe<Channel>>>;
  /** create time */
  createAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  members?: Maybe<Array<Maybe<Member>>>;
  name: Scalars['String']['output'];
  role: MemberRole;
  servers?: Maybe<Array<Maybe<Server>>>;
  /** update time */
  updateAt: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getProfileById: Profile;
  getServer: Server;
  getServers: Array<Server>;
};


export type QueryGetServerArgs = {
  id: Scalars['Float']['input'];
};

export type Server = {
  __typename?: 'Server';
  channels?: Maybe<Array<Maybe<Channel>>>;
  /** create time */
  createAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  inviteCode?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<Maybe<Member>>>;
  name: Scalars['String']['output'];
  profile?: Maybe<Profile>;
  profileId: Scalars['Int']['output'];
  /** update time */
  updateAt: Scalars['String']['output'];
};
