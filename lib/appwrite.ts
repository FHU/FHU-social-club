import {
  Account,
  Client,
  ID,
  Models,
  Query,
  TablesDB,
} from "react-native-appwrite";
import "react-native-url-polyfill/auto";

// Load configuration from environment variables
// Use EXPO_PUBLIC_ prefix for variables accessible in React Native
const getAppWriteConfig = () => {
  const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;
  const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
  const membersTableId = process.env.EXPO_PUBLIC_APPWRITE_MEMBERS_TABLE_ID;

  if (!endpoint || !projectId || !platform || !databaseId || !membersTableId) {
    throw new Error(
      "Missing required AppWrite environment variables. " +
      "Please check your .env file and ensure all EXPO_PUBLIC_APPWRITE_* variables are set."
    );
  }

  return {
    endpoint,
    projectId,
    platform,
    databaseId,
    membersTableId,
  };
};

export const APPWRITE_CONFIG = getAppWriteConfig();

export interface MemberRow extends Models.Row {
  firstName: string;
  lastName: string;
  userID: string;
  club?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
}

export type MemberInput = {
  firstName?: string;
  lastName?: string;
  userID?: string;
  club?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
};

export type AppWriteConfig = {
  endpoint: string;
  projectId: string;
  platform: string; // e.g. 'com.example.app'
  databaseId: string; // TablesDB database id
  membersTableId: string; // Members table id
};
// The returned shape of the service for easy typing elsewhere
export type AppWriteService = ReturnType<typeof createAppWriteService>;

export function createAppWriteService(config: AppWriteConfig) {
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

  const account = new Account(client);
  const tables = new TablesDB(client);

  // AUTH
  const registerWithEmail = async ({
    email,
    password,
    name,
    phone,
    club
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    club: string
  }): Promise<Models.User<Models.Preferences> | null> => {
    try {
      await account.create({ userId: ID.unique(), email, password, name });
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get<Models.User<Models.Preferences>>();
      await createMemberForUser(user, { email, phone, club });

      return user;
    } catch (exception) {
      console.error("[registerWithEmail] Error during registration:", exception);
      return null;
    }
  };

  const loginWithEmail = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Models.User<Models.Preferences> | null> => {
    try {
      await account.createEmailPasswordSession({ email, password });
      return await account.get<Models.User<Models.Preferences>>();
    } catch (exception) {
      console.error("[loginWithEmail] Error during login:", exception);
      return null;
    }
  };

  const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      const user = await account.get<Models.User<Models.Preferences>>();
      return user;
    } catch (exception) {
      console.error("[getCurrentUser] Error fetching current user:", exception);
      return null;
    }
  };

  const logoutCurrentDevice = async () => {
    try {
      await account.deleteSessions();
    } catch {
      // already logged out
    }
  };

  // MEMBERS - DATABASE
  const getMemberByUserId = async (userID: string): Promise<MemberRow | null> => {
    try {
      const response = await tables.listRows<MemberRow>({
        databaseId: config.databaseId,
        tableId: config.membersTableId,
        queries: [Query.equal("userID", userID), Query.limit(1)],
      });

      return response.rows[0] ?? null;
    } catch (exception) {
      console.error("[getMemberByUserId] Error fetching member:", exception);
      return null;
    }
  };

  const createMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const [firstName = "", lastName = ""] = (user.name || "").split(" ");
    const email = user.email ?? extra?.email ?? null;

    return tables.createRow<MemberRow>({
      databaseId: config.databaseId,
      tableId: config.membersTableId,
      rowId: ID.unique(),
      data: {
        firstName: extra?.firstName ?? firstName,
        lastName: extra?.lastName ?? lastName,
        userID: user.$id,
        club: extra?.club ?? undefined,
        phone: extra?.phone ?? undefined,
        email,
      },
      // You can add explicit permissions here if you prefer:
      // permissions: [
      //   Permission.read(Role.user(user.$id)),
      //   Permission.update(Role.user(user.$id)),
      //   Permission.delete(Role.user(user.$id)),
      // ],
    });
  };

  const ensureMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const existing = await getMemberByUserId(user.$id);
    return existing ?? (await createMemberForUser(user, extra));
  };

  const updateMember = async (
    rowId: string,
    data: Partial<MemberInput>
  ): Promise<MemberRow> => {
    return tables.updateRow<MemberRow>({
      databaseId: config.databaseId,
      tableId: config.membersTableId,
      rowId,
      data,
    });
  };

  const getMembers = async (club:string) => {

    try {
      const response = await tables.listRows<MemberRow>({
        databaseId: config.databaseId,
        tableId: config.membersTableId,
        queries: [Query.equal("club", club)],
      });

      return response.rows ?? null;
    } catch (exception) {
      console.error("[getMembers] Error fetching members:", exception);
      return null;
    }

  }

  return {
    // low-level objects
    client,
    account,
    tables,

    // high-level helpers
    getCurrentUser,
    registerWithEmail,
    loginWithEmail,
    logoutCurrentDevice,

    getMemberByUserId,
    createMemberForUser,
    ensureMemberForUser,
    updateMember,
  };
}

/*const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setPlatform(APPWRITE_PLATFORM_NAME)

const account = new Account(client)

async function registerWithEmail( {email, password,name} : {email:string, password:string, name:string}) {

    await account.create({userId:ID.unique(), email, password, name})

    await account.createEmailPasswordSession({email, password})

    return await account.get<Models.User<Models.Preferences>>()
} 

async function loginWithEmail( {email, password}: {email:string, password:string}) {

    await account.createEmailPasswordSession({email, password})

    return await account.get<Models.User<Models.Preferences>>()
}

async function getCurrentUser() {
    try {
        const user = await account.get<Models.User<Models.Preferences>>()
        return user
    }
    catch {
        return null
    }
}

async function logoutCurrentDevice() {
    await account.deleteSession({sessionId: "current"})
}

export const appwrite = {
    client,
    account,
    registerWithEmail,
    loginWithEmail,
    getCurrentUser,
    logoutCurrentDevice
}*/
