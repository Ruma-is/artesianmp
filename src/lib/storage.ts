// src/lib/supabase/storage.ts
import { createClient } from '@/lib/supabase/client'

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @param productId - The product ID (for unique naming)
 * @returns Public URL of uploaded image
 */
export async function uploadProductImage(
  file: File, 
  productId?: string
): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = productId 
    ? `${productId}-${Date.now()}.${fileExt}`
    : `product-${Date.now()}.${fileExt}`
  
  const filePath = `products/${fileName}`

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return publicUrl
}

/**
 * Upload multiple product images
 * @param files - Array of image files
 * @param productId - The product ID
 * @returns Array of public URLs
 */
export async function uploadProductImages(
  files: File[], 
  productId?: string
): Promise<string[]> {
  const uploadPromises = files.map(file => 
    uploadProductImage(file, productId)
  )
  
  return Promise.all(uploadPromises)
}

/**
 * Delete a product image from storage
 * @param imageUrl - Full URL of image to delete
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = createClient()
  
  // Extract file path from URL
  const urlParts = imageUrl.split('/product-images/')
  if (urlParts.length !== 2) {
    throw new Error('Invalid image URL')
  }
  
  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('product-images')
    .remove([filePath])

  if (error) {
    console.error('Delete error:', error)
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}
