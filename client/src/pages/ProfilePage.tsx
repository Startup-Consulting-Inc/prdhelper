/**
 * Profile Page
 *
 * User profile and settings management page with tabs for:
 * - Profile Information (name, email)
 * - Preferences (mode selection)
 * - Security (password change)
 * - Account (delete account)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

type Tab = 'profile' | 'preferences' | 'security' | 'account';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile update
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Preferences
  const [modePreference, setModePreference] = useState<'PLAIN' | 'TECHNICAL'>(
    user?.modePreference || 'PLAIN'
  );
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [preferencesSuccess, setPreferencesSuccess] = useState<string | null>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Mutations
  const updateProfileMutation = trpc.auth.updateProfile.useMutation();
  const changePasswordMutation = trpc.auth.changePassword.useMutation();
  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation();

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const result = await updateProfileMutation.mutateAsync({
        name: profileName,
        modePreference,
      });

      updateUser({
        ...user!,
        name: result.name,
        modePreference: result.modePreference as 'PLAIN' | 'TECHNICAL',
      });

      setProfileSuccess('Profile updated successfully');
    } catch (error: any) {
      setProfileError(error.message || 'Failed to update profile');
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesError(null);
    setPreferencesSuccess(null);

    try {
      const result = await updateProfileMutation.mutateAsync({
        name: user!.name,
        modePreference,
      });

      updateUser({
        ...user!,
        modePreference: result.modePreference as 'PLAIN' | 'TECHNICAL',
      });

      setPreferencesSuccess('Preferences updated successfully');
    } catch (error: any) {
      setPreferencesError(error.message || 'Failed to update preferences');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Password changed successfully');
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync();
      logout();
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile Information' },
    { id: 'preferences' as Tab, label: 'Preferences' },
    { id: 'security' as Tab, label: 'Security' },
    { id: 'account' as Tab, label: 'Account' },
  ];

  // Check if user has a password (not OAuth-only)
  const hasPassword = user?.email && !user?.email?.includes('oauth');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Profile Settings
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Profile Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Update your personal information
                  </p>
                </div>

                {profileError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400 text-sm">
                    {profileSuccess}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'preferences' && (
              <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Preferences
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Configure your application preferences
                  </p>
                </div>

                {preferencesError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                    {preferencesError}
                  </div>
                )}

                {preferencesSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400 text-sm">
                    {preferencesSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Default Mode
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        value="PLAIN"
                        checked={modePreference === 'PLAIN'}
                        onChange={(e) =>
                          setModePreference(e.target.value as 'PLAIN' | 'TECHNICAL')
                        }
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Plain Mode
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For business stakeholders and non-technical users using AI-powered visual builders.
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          <strong>Best for:</strong> V0, Lovable, Bubble, Replit, Bolt
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <strong>Generates:</strong> BRD and PRD with vibe coding prompts
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        value="TECHNICAL"
                        checked={modePreference === 'TECHNICAL'}
                        onChange={(e) =>
                          setModePreference(e.target.value as 'PLAIN' | 'TECHNICAL')
                        }
                        className="mr-3 mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Technical Mode
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          For developers and technical teams using code-first development tools.
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          <strong>Best for:</strong> CLI, Cursor, Claude Code, VS Code, IDEs
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <strong>Generates:</strong> BRD, PRD, and detailed technical task lists
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Updating...' : 'Update Preferences'}
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Security
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Change your password to keep your account secure
                  </p>
                </div>

                {!hasPassword && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-blue-600 dark:text-blue-400 text-sm">
                    You signed in with Google. Password change is not available for OAuth accounts.
                  </div>
                )}

                {hasPassword && (
                  <>
                    {passwordError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400 text-sm">
                        {passwordSuccess}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          minLength={8}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Must be at least 8 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Permanently delete your account and all associated data
                  </p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                    Warning: This action cannot be undone
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    Deleting your account will:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1 mb-4">
                    <li>Permanently delete all your projects</li>
                    <li>Remove all generated documents</li>
                    <li>Delete your conversation history</li>
                    <li>Erase all your personal data</li>
                  </ul>

                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountMutation.isPending}
                  >
                    {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete My Account'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default ProfilePage;
