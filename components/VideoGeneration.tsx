"use client";
import React, { useState } from 'react';
import * as fal from "@fal-ai/serverless-client";

// Define interfaces for the expected response structure from the Fal.ai API
interface VideoGenerationResponse {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
}

interface UpscaleResponse {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    width: number;
    height: number;
  };
}

interface RemoveBgResponse {
    image: {
      url: string;
      content_type: string; // MIME type of the image, e.g., "image/png"
      file_name: string;    // The name of the file
      file_size: number;    // The size of the file in bytes
      width: number;        // The width of the image in pixels
      height: number;       // The height of the image in pixels
    };
  }

fal.config({
  proxyUrl: '/api/fal/proxy',
});

const VideoGenerationForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [motionBucketId, setMotionBucketId] = useState(127);
    const [condAug, setCondAug] = useState(0.02);
    const [steps, setSteps] = useState(4);
    const [fps, setFps] = useState(10);
    const [seed, setSeed] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [upscaledImageUrl, setUpscaledImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageToVideo, setImageToVideo] = useState(false);
    const [upscale, setUpscale] = useState(false);
    const [scale, setScale] = useState(2);
    const [tile, setTile] = useState(0);
    const [face, setFace] = useState(false);
    const [model, setModel] = useState("RealESRGAN_x4plus");
    const [textPrompt, setTextPrompt] = useState('');
    const [removeBg, setRemoveBg] = useState(false);
    const [bgRemovedImageUrl, setBgRemovedImageUrl] = useState('');
    const [photoMaker, setPhotoMaker] = useState(false); // New state for "Photo Maker"
    const [generatedPhotoUrl, setGeneratedPhotoUrl] = useState<string>(''); // State to store the generated photo URL
    const [basePipeline, setBasePipeline] = useState('photomaker');
    const [imageArchiveUrl, setImageArchiveUrl] = useState('');
    const [photoMakerPrompt, setPhotoMakerPrompt] = useState('');
    const [numInferenceSteps, setNumInferenceSteps] = useState(50);
    const [styleStrength, setStyleStrength] = useState(20);
    const [numImages, setNumImages] = useState(1);
    const [guidanceScale, setGuidanceScale] = useState(5.0);
    const [style, setStyle] = useState('Photographic'); // Default value is 'Photographic'
    


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        
        let base64Image: string | null = null;
        if (image) {
            base64Image = await convertImageToBase64(image).catch((error) => {
                console.error("Error converting image to Base64:", error);
                alert("Error processing image.");
                setLoading(false);
                return null;
            });
        }
    
        if (!base64Image && !textPrompt) {
            alert('Please select an image or enter a text prompt.');
            setLoading(false);
            return;
        }
        
        const operationPromises = [];
    
        if (imageToVideo) {
            // Replace this with your actual Image to Video functionality
            const imageToVideoOperation = async () => {
                e.preventDefault();
                if (!image) {
                    alert('Please select an image.');
                    return;
                }
        
                setLoading(true);
                const base64Image = await convertImageToBase64(image);
        
                try {
                    const result = await fal.subscribe("fal-ai/fast-svd-lcm", {
                        input: {
                            image_url: base64Image,
                            motion_bucket_id: motionBucketId,
                            cond_aug: condAug,
                            steps,
                            fps,
                            ...(seed && { seed: parseInt(seed, 10) }),
                        },
                        logs: true,
                        onQueueUpdate: (update) => {
                            console.log("queue update", update);
                        },
                    }) as unknown as VideoGenerationResponse;
        
                    if (result.video && result.video.url) {
                        setVideoUrl(result.video.url);
                    }
                } catch (error) {
                    console.error("Failed to generate video:", error);
                    alert("Failed to generate video. Please try again.");
                } finally {
                    setLoading(false);
                }
            };
            operationPromises.push(imageToVideoOperation());
        }
    
        if (upscale && base64Image) {
            const upscaleOperation = fal.subscribe("fal-ai/esrgan", {
                input: {
                    image_url: base64Image,
                    scale,
                    tile,
                    face,
                    model,
                },
                logs: true,
                onQueueUpdate: (update) => console.log("Queue Update:", update),
            }).then((result: unknown) => {
                const upscaleResult = result as UpscaleResponse;
                if (upscaleResult.image && upscaleResult.image.url) {
                    setUpscaledImageUrl(upscaleResult.image.url);
                }
            }).catch(error => {
                console.error("Upscale operation failed:", error);
            });
    
            operationPromises.push(upscaleOperation);
        }
    
        // Remove Background operation
        if (removeBg && base64Image) {
            const removeBgOperation = fal.subscribe("fal-ai/imageutils/rembg", {
                input: {
                    image_url: base64Image,
                },
                logs: true,
                onQueueUpdate: (update) => console.log("Queue Update:", update),
            }).then((result: unknown) => {
                const bgRemovedResult = result as { image: { url: string } };
                if (bgRemovedResult.image && bgRemovedResult.image.url) {
                    setBgRemovedImageUrl(bgRemovedResult.image.url);
                }
            }).catch(error => {
                console.error("Remove Background operation failed:", error);
            });
    
            operationPromises.push(removeBgOperation);
        }
        if (photoMaker) {
            const photoMakerOperation = fal.subscribe("fal-ai/photomaker", {
                input: {
                    // Assuming the API can accept a base64 encoded string directly or you have a mechanism to convert this to a URL
                    prompt: photoMakerPrompt,
                    base_pipeline: basePipeline,
                    image_archive_url: image ? base64Image : undefined, // Use base64Image if available
                    style: style,
                    num_inference_steps: numInferenceSteps,
            style_strength: styleStrength,
            num_images: numImages,
            guidance_scale: guidanceScale,
            seed: seed ? parseInt(seed) : undefined, // Convert seed to an integer if provided
        },
        logs: true,
        onQueueUpdate: (update) => {
            console.log("Queue Update:", update);
        },
    }).then((result: unknown) => {
        const photoMakerResult = result as { images: Array<{ url: string }> };
        if (photoMakerResult.images.length > 0) {
            // Assuming we're interested in the first image
            setGeneratedPhotoUrl(photoMakerResult.images[0].url);
        }
    }).catch(error => {
        console.error("Photo Maker operation failed:", error);
    });

    operationPromises.push(photoMakerOperation);
}
        // Execute all prepared operations
        Promise.allSettled(operationPromises).then(() => {
            setLoading(false);
        }).catch(error => {
            console.error("Error executing operations:", error);
            alert("Failed to process the request. Please try again.");
            setLoading(false);
        });
    };

    return (
        <div className="mx-auto mt-8 shadow-lg rounded-lg flex justify-between space-x-4 w-full">
            {/* Image Upload Column */}
            <div className="flex-1 p-4">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
            <label htmlFor="image-upload" className="mb-2 text-lg font-medium">
                Image Upload
            </label>
            <input id="image-upload" type="file" onChange={handleImageChange} className="p-2 border rounded text-white"/>
        </div>
        <div className="flex flex-col"> {/* Text to Image Input */}
            <label htmlFor="text-prompt" className="mb-2 text-lg font-medium">
                Text to Image
            </label>
            <input id="text-prompt" type="text" value={textPrompt} onChange={(e) => setTextPrompt(e.target.value)} className="p-2 border rounded text-black"/>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary mt-4 self-center">
            {loading ? 'Processing...' : 'Submit'}
        </button>
    </form>
</div>

            {/* Options Column */}
            <div className="flex-1 p-4">
            <div className="flex flex-col gap-4">
                {/* Image to Video Accordion */}
                <div className="accordion-section">
                    <label htmlFor="image-to-video" className={`text-xl font-medium cursor-pointer ${imageToVideo ? 'glow-on-hover rainbow-text' : ''}`}>
                        <input id="image-to-video" type="checkbox" checked={imageToVideo} onChange={(e) => setImageToVideo(e.target.checked)} className="mr-6 transform scale-150 cursor-pointer"/>
                        Image to Video
                    </label>
            {imageToVideo && (
                <div className="accordion-content">
                    {/* Insert all Image to Video specific inputs here */}
                </div>
            )}
        </div>
        
        {/* Upscale Accordion */}
        <div className="accordion-section">
                    <label htmlFor="upscale" className={`text-xl font-medium cursor-pointer ${upscale ? 'glow-on-hover rainbow-text' : ''}`}>
                        <input id="upscale" type="checkbox" checked={upscale} onChange={(e) => setUpscale(e.target.checked)} className="mr-6 transform scale-150 cursor-pointer"/>
                        Upscale
                    </label>
                    {upscale && (
                        <div className="accordion-content">
                            {/* Insert all Upscale specific inputs here */}
                        </div>
                    )}
        </div>
        
       {/* Remove Background Accordion */}
<div className="accordion-section flex items-center"> {/* Ensure alignment */}
  <label htmlFor="remove-bg" className="switch mr-2"> {/* Switch to the left and add margin to the right */}
    <input id="remove-bg" type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="opacity-0 absolute h-0 w-0" />
    <span className="slider round"></span> {/* The visual toggle switch */}
  </label>
  <label htmlFor="remove-bg" className={`text-xl font-medium cursor-pointer ${removeBg ? 'glow-on-hover rainbow-text' : ''}`}>
    Remove Background
  </label>
  {removeBg && (
    <div className="accordion-content">
      {/* Remove Background specific inputs */}
    </div>
                    )}
                </div>

                {/* Photo Maker Accordion */}
                <div className="accordion-section">
                    <label htmlFor="photoMaker" className={`text-xl font-medium cursor-pointer ${photoMaker ? 'glow-on-hover rainbow-text' : ''}`}>
                        <input id="photoMaker" type="checkbox" checked={photoMaker} onChange={(e) => setPhotoMaker(e.target.checked)} className="mr-6 transform scale-150 cursor-pointer"/>
                        Photo Maker
                    </label>
        </div>
                    
                    {/* Conditional Rendering for Image to Video Options */}
                    {imageToVideo && (
                        <>
                            <div className="flex flex-col">
                                <label htmlFor="motion-bucket-id" className="mb-2 text-lg font-medium">
                                    Motion Bucket ID
                                </label>
                                <input id="motion-bucket-id" type="range" min="1" max="255" value={motionBucketId} onChange={(e) => setMotionBucketId(parseInt(e.target.value, 10))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="cond-aug" className="mb-2 text-lg font-medium">
                                    Cond Aug
                                </label>
                                <input id="cond-aug" type="number" step="0.01" value={condAug} onChange={(e) => setCondAug(parseFloat(e.target.value))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="steps" className="mb-2 text-lg font-medium">
                                    Steps
                                </label>
                                <input id="steps" type="number" value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="fps" className="mb-2 text-lg font-medium">
                                    FPS
                                </label>
                                <input id="fps" type="number" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="seed" className="mb-2 text-lg font-medium">
                                    Seed (optional)
                                </label>
                                <input id="seed" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} className="p-2 border rounded text-black"/>
                            </div>
                        </>
                    )}
                    
                    {/* Conditional Rendering for Upscale Options */}
                    {upscale && (
                        <>
                            <div className="flex flex-col">
                                <label htmlFor="scale" className="mb-2 text-lg font-medium">Scale</label>
                                <input id="scale" type="number" value={scale} onChange={(e) => setScale(parseInt(e.target.value, 10))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="tile" className="mb-2 text-lg font-medium">Tile</label>
                                <input id="tile" type="number" value={tile} onChange={(e) => setTile(parseInt(e.target.value, 10))} className="p-2 border rounded text-black"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="face" className="mb-2 text-lg font-medium">Face</label>
                                <input id="face" type="checkbox" checked={face} onChange={(e) => setFace(e.target.checked)} className="p-2 border rounded"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="model" className="mb-2 text-lg font-medium">Model</label>
                                <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className="p-2 border rounded text-black">
                                    <option value="RealESRGAN_x4plus">RealESRGAN_x4plus</option>
                                    <option value="RealESRGAN_x2plus">RealESRGAN_x2plus</option>
                                    <option value="RealESRGAN_x4plus_anime_6B">RealESRGAN_x4plus_anime_6B</option>
                                    <option value="RealESRGAN_x4_v3">RealESRGAN_x4_v3</option>
                                    <option value="RealESRGAN_x4_wdn_v3">RealESRGAN_x4_wdn_v3</option>
                                    <option value="RealESRGAN_x4_anime_v3">RealESRGAN_x4_anime_v3</option>
                                </select>
                            </div>
                        </>
                    )}
                    {/* Conditional Rendering for Photo Maker Options */}
        {photoMaker && (
            <>
       <div className="photo-maker-style">
    <label htmlFor="style" className="photo-maker-label">Style</label>
    <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="photo-maker-select" style={{color: 'black'}}>
        <option value="Photographic" style={{color: 'black'}}>Photographic</option>
        <option value="Cinematic" style={{color: 'black'}}>Cinematic</option>
        <option value="Disney Character" style={{color: 'black'}}>Disney Character</option>
        <option value="Digital Art" style={{color: 'black'}}>Digital Art</option>
        <option value="Fantasy art" style={{color: 'black'}}>Fantasy art</option>
        <option value="Neonpunk" style={{color: 'black'}}>Neonpunk</option>
        <option value="Enhance" style={{color: 'black'}}>Enhance</option>
        <option value="Comic book" style={{color: 'black'}}>Comic book</option>
        <option value="Lowpoly" style={{color: 'black'}}>Lowpoly</option>
        <option value="Line art" style={{color: 'black'}}>Line art</option>
        <option value="(No style)" style={{color: 'black'}}>(No style)</option>
    </select>
</div>
               <div className="photo-maker-num-inference-steps">
    <label htmlFor="num-inference-steps" className="photo-maker-label">Number of Inference Steps</label>
    <input id="num-inference-steps" type="number" value={numInferenceSteps} onChange={(e) => setNumInferenceSteps(parseInt(e.target.value, 10))} style={{color: 'black'}} className="photo-maker-input"/>
</div>

<div className="photo-maker-style-strength">
    <label htmlFor="style-strength" className="photo-maker-label">Style Strength</label>
    <input id="style-strength" type="number" value={styleStrength} onChange={(e) => setStyleStrength(parseInt(e.target.value, 10))} style={{color: 'black'}} className="photo-maker-input"/>
</div>

<div className="photo-maker-num-images">
    <label htmlFor="num-images" className="photo-maker-label">Number of Images</label>
    <input id="num-images" type="number" value={numImages} onChange={(e) => setNumImages(parseInt(e.target.value, 10))} style={{color: 'black'}} className="photo-maker-input"/>
</div>

<div className="photo-maker-guidance-scale">
    <label htmlFor="guidance-scale" className="photo-maker-label">Guidance Scale</label>
    <input id="guidance-scale" type="number" value={guidanceScale} onChange={(e) => setGuidanceScale(parseFloat(e.target.value))} style={{color: 'black'}} className="photo-maker-input"/>
</div>

<div className="photo-maker-seed">
    <label htmlFor="seed" className="photo-maker-label">Seed</label>
    <input id="seed" type="text" value={seed} onChange={(e) => setSeed(e.target.value)} style={{color: 'black'}} className="photo-maker-input"/>
</div>
        <div className="flex flex-col">
            <label htmlFor="photo-maker-prompt" className="mb-2 text-lg font-medium">Prompt</label>
            <input id="photo-maker-prompt" type="text" value={photoMakerPrompt} onChange={(e) => setPhotoMakerPrompt(e.target.value)} className="p-6 border rounded text-black"/>
        </div>
        <div className="flex flex-col">
            <label htmlFor="base-pipeline" className="mb-2 text-lg font-medium">Base Pipeline</label>
            <select id="base-pipeline" value={basePipeline} onChange={(e) => setBasePipeline(e.target.value)} className="p-2 border rounded text-black">
                <option value="photomaker">photomaker</option>
                <option value="photomaker-style">photomaker-style</option>
            </select>
        </div>
                {/* Add additional input fields for base_pipeline, initial_image_url, etc., similar to above */}
            </>
        )}
                </div>
            </div>

            {/* Output Column */}
            <div className="flex-1 p-4">
    {videoUrl && <video src={videoUrl} controls className="max-w-full"/>}
    {upscaledImageUrl && <img src={upscaledImageUrl} alt="Upscaled Image" className="max-w-full mt-4"/>}
    {bgRemovedImageUrl && <img src={bgRemovedImageUrl} alt="Background Removed Image" className="max-w-full mt-4"/>}
    {generatedPhotoUrl && <img src={generatedPhotoUrl} alt="Generated Photo" className="max-w-full mt-4"/>}
    {/* Display additional generated photos if using an array */}
</div>
        </div>
        
    );
};

export default VideoGenerationForm;

function convertImageToBase64(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file.'));
        };
        reader.readAsDataURL(image);
    });
}