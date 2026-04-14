import { supabase } from '@/integrations/supabase/client';

/**
 * Upload payment screenshot to Supabase Storage
 * Returns public URL for sharing in WhatsApp
 */
export const uploadPaymentScreenshot = async (
  file: File | null,
  customerName: string,
  phoneNumber: string
): Promise<{ url: string; filename: string } | null> => {
  try {
    if (!file) {
      console.error('❌ No file provided');
      return null;
    }

    console.log('📸 Starting screenshot upload...');
    console.log('📄 File details:', {
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('❌ File must be an image. Received:', file.type);
      return null;
    }

    console.log('✅ File type validated:', file.type);

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${sanitizedName}_${phoneNumber}_${timestamp}.${extension}`;

    console.log(`📤 Uploading with filename: ${filename}`);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(`bookings/${filename}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Upload error:', {
        message: error.message,
        status: error.statusCode,
        error: error,
      });
      return null;
    }

    console.log('✅ File uploaded successfully:', {
      path: data.path,
      id: data.id,
      fullPath: data.fullPath,
    });

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
    console.log('🎉 Screenshot upload completed successfully!');

    return {
      url: publicUrl,
      filename: data.path,
    };
  } catch (error) {
    console.error('❌ Screenshot upload error:', {
      message: error instanceof Error ? error.message : String(error),
      error: error,
    });
    return null;
  }
};

/**
 * Delete payment screenshot from Supabase Storage
 */
export const deletePaymentScreenshot = async (filename: string): Promise<boolean> => {
  try {
    console.log('🗑️ Deleting screenshot:', filename);

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
