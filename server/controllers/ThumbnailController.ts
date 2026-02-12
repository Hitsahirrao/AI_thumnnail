import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail.js';
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
import fs from 'fs';
import path from 'path';
import {v2 as cloudinary} from 'cloudinary'


const stylePropmts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography,vibrant colors, expressive facial reaction, dramatic lighting,high contrast, click-worthy composition, professional style','Tech/Futuristic': 'futuristic thumbnail, sleek modern design,digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere', 'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point', 'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field', 'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style' ,

}

const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, boldcontrasts, eye-catching palette',sunset: 'warm sunset tones, orange pink and purple hues, softgradients, cinematic glow', forest: 'natural green tones, earthy colors, calm and organicpalette, fresh atmosphere',neon: 'neon glow effects, electric blues and pinks, cyberpunklighting, high contrast glow',purple: 'purple-dominant color palette, magenta and violettones, modern and stylish mood',monochrome: 'black and white color scheme, high contrast,dramatic lighting, timeless aesthetic',ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',pastel: 'soft pastel colors, low saturation, gentle tones, calmand friendly aesthetic',
    }

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay
    } = req.body;

    if (!title || !user_prompt) {
      return res.status(400).json({ message: 'title and prompt are required' });
    }

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true
    })

    const model = 'gemini-3-pro-image-preview';

    const generationConfig:GenerateContentConfig = {
        maxOutputTokens: 32768,
        temperature : 1,
        responseModalities:['IMAGE'],
        imageConfig:{
            aspectRatio: aspect_ratio ||'16:9',
            imageSize:'1K'
        },
        safetySettings:[
            {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,threshold: HarmBlockThreshold.OFF },
            {category:HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold:HarmBlockThreshold.OFF},
            {category:HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,threshold:HarmBlockThreshold.OFF},
            {category:HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF},   
            
        ]
    }

    let prompt = `Create a ${stylePropmts[style as keyof typeof stylePropmts]} for: "${title}"`;

    if(color_scheme){
        prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme.`
    }

    if(user_prompt){
        prompt += `Additional details: ${user_prompt}.`
    }

    prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through click-through rate. make it blod, professional, and impossible to ingore.`

    //Generate img usoing AI model
    const response: any = await ai.models.generateContent({
        model,
        contents:[prompt],
        config: generationConfig
    })

    //check if response is valid

    if(!response?.candidates?.[0]?.content.parts){
        throw new Error('Unexpected response')
    }

    const parts = response.candidates[0].content.parts;

    let finalBuffer : Buffer | null =null;

    for(const part of parts){
        if(part.inlineData){
            finalBuffer = Buffer.from(part.inlineData.data, 'base64')
        }
    }

    const filename = `final-output-${Date.now()}.png`;
    const filepath = path.join('images',filename);

    // create a image directory if does not exist
    fs.mkdirSync('images',{recursive: true});

    const uploadResult = await cloudinary.uploader.upload
    (filepath,{resource_type:'image'})

    thumbnail.image_url = uploadResult.url;
    thumbnail.isGenerating = false;
    await thumbnail.save()

    res.json({message:'Thumbnail Generated', thumbnail})

    // remove image file from disk
    fs.unlinkSync(filepath)

  } catch (error:any) {
    console.log(error);
    res.status(500).json({message:error.message});
  }
}

//controller for Thumbnail Deletion
export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {userId} = req.session;
        
        await Thumbnail.findByIdAndDelete({_id: id, userId})

        res.json({message: 'Thumbnail deleted successfully'});

    } catch (error:any) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}