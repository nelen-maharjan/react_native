import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";

export const config = {
  platform: "com.react-native-crash-course",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if(!response) throw new Error('failed to login');

    const browserResult = await openAuthSessionAsync(
        response.toString(),
        redirectUri
    )

    if(browserResult !== 'success') throw new Error('Failed to login');
    
    const url = new URL(browserResult.url);

    const secret = url.searchParams.get('secret')?.toString();
    const userId = url.searchParams.get('secret')?.toString();

    if(!secret || !userId) throw new Error('Failed to login');

    const session = await account.createSession(secret, userId);

    if(!session) throw new Error('Failed to create session');

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
