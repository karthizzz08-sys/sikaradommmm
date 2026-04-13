// @ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WhatsAppPayload {
  phone: string;
  message: string;
  image?: string; // Base64 encoded image
  imageName?: string;
}

console.log("WhatsApp Function initialized!")

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const payload: WhatsAppPayload = await req.json()
    const { phone, message, image, imageName } = payload

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    let imageUrl: string | null = null

    if (supabaseUrl && supabaseKey && image && imageName) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      try {
        const imageData = image.split(',')[1]
        const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0))
        const fileName = `payment-screenshots/${Date.now()}-${imageName}`

        const { error: uploadError } = await supabase.storage
          .from('whatsapp-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('whatsapp-images')
            .getPublicUrl(fileName)

          imageUrl = urlData.publicUrl
        } else {
          console.error('❌ Image upload error:', uploadError)
        }
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError)
      }
    }

    const callMeBotApiKey = Deno.env.get('CALLMEBOT_API_KEY')
    if (callMeBotApiKey && imageUrl) {
      const imageApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${callMeBotApiKey}&image=${encodeURIComponent(imageUrl)}`
      const imageResponse = await fetch(imageApiUrl)
      await imageResponse.text()

      await new Promise(resolve => setTimeout(resolve, 1500))

      const messageApiUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&apikey=${callMeBotApiKey}&text=${encodeURIComponent(message)}`
      const messageResponse = await fetch(messageApiUrl)
      const messageResult = await messageResponse.text()

      if (messageResult.includes('Message sent successfully')) {
        return new Response(
          JSON.stringify({ success: true, method: 'callmebot', imageSent: true, messageSent: true }),
          { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        )
      }
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER')

    if (accountSid && authToken && fromNumber) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
      const requestBody = new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${phone}`,
        Body: message
      })

      if (imageUrl) {
        requestBody.append('MediaUrl', imageUrl)
      }

      const auth = btoa(`${accountSid}:${authToken}`)
      const twilioResponse = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody
      })

      const result = await twilioResponse.json()
      if (twilioResponse.ok) {
        return new Response(
          JSON.stringify({ success: true, method: 'twilio', messageId: result.sid, imageSent: !!imageUrl }),
          { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        )
      }
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    return new Response(
      JSON.stringify({ success: false, fallback: { whatsappUrl, message: 'Please open WhatsApp and attach the payment screenshot manually', imageUrl, imageData: image } }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  } catch (error) {
    console.error('❌ Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start`
  2. POST to http://127.0.0.1:54321/functions/v1/send-whatsapp
*/
