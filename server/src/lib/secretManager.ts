/**
 * Google Secret Manager Utility
 *
 * Provides secure access to secrets stored in Google Cloud Secret Manager.
 * Used for sensitive credentials like Gmail app passwords.
 */

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

/**
 * Get a secret value from Google Secret Manager
 * @param secretName - Name of the secret (e.g., 'GMAIL_APP_PASSWORD')
 * @returns The secret value as a string
 */
export async function getSecret(secretName: string): Promise<string> {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!projectId) {
      throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set');
    }

    // Construct the resource name of the secret version
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

    // Access the secret version
    const [version] = await client.accessSecretVersion({ name });

    // Extract the payload as a string
    const payload = version.payload?.data?.toString();

    if (!payload) {
      throw new Error(`Secret ${secretName} has no payload`);
    }

    return payload;
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    throw new Error(`Failed to fetch secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get multiple secrets at once
 * @param secretNames - Array of secret names
 * @returns Object with secret names as keys and values as values
 */
export async function getSecrets(secretNames: string[]): Promise<Record<string, string>> {
  const secrets: Record<string, string> = {};

  await Promise.all(
    secretNames.map(async (name) => {
      secrets[name] = await getSecret(name);
    })
  );

  return secrets;
}
