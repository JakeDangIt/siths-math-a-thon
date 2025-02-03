// server/api/updateUser.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default defineEventHandler(async (event) => {
  const { userId, updates, avatarFile, avatarPath } = await readBody(event);

  if (!userId || (!updates && !avatarFile)) {
    return { error: 'Invalid parameters' };
  }

  try {
    // If there's an avatar file, handle the upload
    if (avatarFile && avatarPath) {
      // Delete the existing avatar first (if applicable)
      await supabase.storage.from('avatars').remove([avatarPath]);

      // Upload the new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(avatarPath, avatarFile);

      if (uploadError) {
        console.error('Avatar upload error:', uploadError.message);
        return { error: 'Error uploading avatar: ' + uploadError.message };
      }

      // Add avatar path to updates
      updates.avatar = avatarPath;
    }

    // Update user metadata in authentication
    if (Object.keys(updates).length > 0) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        id: userId,
        data: updates,
      });

      if (updateAuthError) {
        console.error('User metadata update error:', updateAuthError.message);
        return { error: 'Error updating user metadata: ' + updateAuthError.message };
      }

      // Update user profile in database
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('uid', userId);

      if (updateProfileError) {
        console.error('Profile update error:', updateProfileError.message);
        return { error: 'Error updating profile: ' + updateProfileError.message };
      }
    }

    return { success: true, message: 'User updated successfully' };
  } catch (err) {
    console.error('Server updateUser error:', err);
    return { error: 'Internal server error' };
  }
});
