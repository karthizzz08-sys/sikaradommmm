import { supabase } from '@/integrations/supabase/client';

/**
 * Upload payment screenshot to Supabase Storage
 * Returns public URL for sharing in WhatsApp
 */
export const uploadPaymentScreenshot = async (
  file: File,
  customerName: string,
  phoneNumber: string
): Promise<{ url: string; filename: string } | null> => {
  try {
    if (!file) {
      console.error('❌ No file provided');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ File must be an image');
      return null;
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedName}_${phoneNumber}_${timestamp}.${file.name.split('.').pop()}`;

    console.log(`📤 Uploading screenshot: ${filename}`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(`bookings/${filename}`, file);

    if (error) {
      console.error('❌ Upload error:', error.message);
      return null;
    }

    console.log('✅ File uploaded:', data);

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('payment-screenshots')
      .getPublicUrl(`bookings/${filename}`);

    const publicUrl = publicData?.publicUrl;

    if (!publicUrl) {
      console.error('❌ Could not generate public URL');
      return null;
    }

    console.log('✅ Public URL generated:', publicUrl);

    return {
      url: publicUrl,
      filename: data.path,
    };
  } catch (error) {
    console.error('❌ Screenshot upload error:', error);
    return null;
  }
};

/**
 * Delete payment screenshot from Supabase Storage
 */
export const deletePaymentScreenshot = async (filename: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('payment-screenshots')
      .remove([filename]);

    if (error) {
      console.error('❌ Delete error:', error.message);
      return false;
    }

    console.log('✅ Screenshot deleted:', filename);
    return true;
  } catch (error) {
    console.error('❌ Screenshot deletion error:', error);
    return false;
  }
};
