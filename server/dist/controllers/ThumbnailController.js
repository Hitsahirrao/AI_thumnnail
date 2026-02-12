import Thumbnail from '../models/Thumbnail.js';
import { HarmBlockThreshold, HarmCategory } from '@google/genai';
import ai from '../configs/ai.js';
import { v2 as cloudinary } from 'cloudinary';
const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
};
const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, boldcontrasts, eye-catching palette', sunset: 'warm sunset tones, orange pink and purple hues, softgradients, cinematic glow', forest: 'natural green tones, earthy colors, calm and organicpalette, fresh atmosphere', neon: 'neon glow effects, electric blues and pinks, cyberpunklighting, high contrast glow', purple: 'purple-dominant color palette, magenta and violettones, modern and stylish mood', monochrome: 'black and white color scheme, high contrast,dramatic lighting, timeless aesthetic', ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere', pastel: 'soft pastel colors, low saturation, gentle tones, calmand friendly aesthetic',
};
export const generateThumbnail = async (req, res) => {
    let thumbnail = null;
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;
        if (!title || !user_prompt) {
            return res.status(400).json({ message: 'title and prompt are required' });
        }
        thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        });
        const model = 'gemini-3-pro-image-preview';
        const generationConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1K'
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF },
            ]
        };
        let prompt = `Create a ${stylePrompts[style]} for: "${title}"`;
        if (color_scheme) {
            prompt += `Use a ${colorSchemeDescriptions[color_scheme]} color scheme.`;
        }
        if (user_prompt) {
            prompt += `Additional details: ${user_prompt}.`;
        }
        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;
        // Generate image using AI model
        const response = await ai.models.generateContent({
            model,
            contents: [prompt],
            config: generationConfig
        });
        //check if response is valid
        if (!response?.candidates?.[0]?.content.parts) {
            throw new Error('Unexpected response');
        }
        const parts = response.candidates[0].content.parts;
        let finalBuffer = null;
        for (const part of parts) {
            if (part.inlineData?.data) {
                finalBuffer = Buffer.from(part.inlineData.data, 'base64');
                break;
            }
        }
        if (!finalBuffer)
            throw new Error('No image data returned from model');
        // Upload buffer to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'thumbnails' }, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
            stream.end(finalBuffer);
        });
        // Save image url to DB and mark generation complete
        thumbnail.image_url = uploadResult?.secure_url || '';
        thumbnail.isGenerating = false;
        await thumbnail.save();
        return res.status(200).json({ thumbnail });
    }
    catch (error) {
        console.error('generateThumbnail error:', error);
        try {
            if (typeof thumbnail !== 'undefined' && thumbnail) {
                thumbnail.isGenerating = false;
                await thumbnail.save();
            }
        }
        catch (e) {
            console.error('Failed to update thumbnail on error:', e);
        }
        return res.status(500).json({ message: 'Thumbnail generation failed', error: error.message });
    }
};
