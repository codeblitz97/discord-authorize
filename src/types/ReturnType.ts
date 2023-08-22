interface UserInfo {
  id: string; // snowflake - the user's id - identify
  username: string; // string - the user's username, not unique across the platform - identify
  discriminator: string; // string - the user's Discord-tag - identify
  global_name?: string | null; // string | null - the user's display name, if it is set. For bots, this is the application name - identify
  avatar?: string | null; // string | null - the user's avatar hash - identify
  bot?: boolean; // boolean - whether the user belongs to an OAuth2 application - identify
  system?: boolean; // boolean - whether the user is an Official Discord System user - identify
  mfa_enabled?: boolean; // boolean - whether the user has two factor enabled on their account - identify
  banner?: string | null; // string | null - the user's banner hash - identify
  accent_color?: number | null; // number | null - the user's banner color encoded as an integer representation of hexadecimal color code - identify
  locale?: string | null; // string | null - the user's chosen language option - identify
  verified?: boolean; // boolean - whether the email on this account has been verified - email
  email?: string | null; // string | null - the user's email - email
  flags?: number; // number - the flags on a user's account - identify
  premium_type?: number; // number - the type of Nitro subscription on a user's account - identify
  public_flags?: number; // number - the public flags on a user's account - identify
  avatar_decoration?: string | null; // string | null - the user's avatar decoration hash - identify
}

interface ConnectionType {
  id: string;
  name: string;
  type: string;
  friend_sync: boolean;
  metadata_visibility: number;
  show_activity: boolean;
  two_way_link: boolean;
  verified: boolean;
  visibility: number;
}

export { UserInfo, ConnectionType };
