"use client"

import React, { useState } from 'react';
import * as fal from "@fal-ai/serverless-client";

// Define an interface for the expected response structure from the Fal.ai API
interface VideoGenerationResponse {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
  seed?: number;
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
    const [loading, setLoading] = useState(false);
    const [imageToVideo, setImageToVideo] = useState(false);
    const [upscale, setUpscale] = useState(false);
    const [removeBg, setRemoveBg] = useState(false);
    const [photoMaker, setPhotoMaker] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label>
                  Image Upload
                  <input type="file" onChange={handleImageChange} />
                </label>
                <label>
                  Motion Bucket ID
                  <input type="range" min="1" max="255" value={motionBucketId} onChange={(e) => setMotionBucketId(parseInt(e.target.value, 10))} />
                </label>
                <label>
                  Cond Aug
                  <input type="number" step="0.01" value={condAug} onChange={(e) => setCondAug(parseFloat(e.target.value))} />
                </label>
                <label>
                  Steps
                  <input type="number" value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} />
                </label>
                <label>
                  FPS
                  <input type="number" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} />
                </label>
                <label>
                  Seed (optional)
                  <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} />
                </label>
                <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
            </form>
            {videoUrl && <video src={videoUrl} controls />}
            <style jsx>{`
  .form-container {
    max-width: 600px; /* Adjusted width for better layout */
    margin: 40px auto; /* Centering the form with top and bottom margin */
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border-radius: 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center; /* Align items to the center horizontally */
  }
  form {
    width: 100%; /* Form takes full width of its container */
    display: flex;
    flex-direction: column;
    align-items: center; /* Align form items to the center horizontally */
    gap: 20px; /* Space between each form item */
  }
  .input-group {
    width: 90%; /* Each input group takes 90% of form width */
    display: flex;
    flex-direction: column;
    align-items: center; /* Align labels and inputs to the center horizontally */
  }
  label {
    font-size: 16px; /* Larger font size for better readability */
    color: #333; /* Darker font color for contrast */
    margin-bottom: 5px; /* Space between label and input */
    text-align: center; /* Center-align the text of labels */
    width: 100%; /* Labels take full width of their container */
  }
  input[type="file"], input[type="range"], input[type="number"], input[type="text"], button {
    width: 100%; /* Inputs and button take full width of their container */
    padding: 8px;
    margin: 0 auto; /* Centering inputs and button horizontally */
  }
  input[type="range"] {
    -webkit-appearance: none; /* Removes default webkit styles */
    appearance: none;
    background: #ddd; /* Light grey background */
    outline: none; /* Removes the outline */
    opacity: 0.7; /* Partial transparency */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
  }
  /* Custom styles for range thumb */
  input[type="range"]::-webkit-slider-thumb, input[type="range"]::-moz-range-thumb {
    -webkit-appearance: none; /* Removes default webkit styles */
    appearance: none;
    width: 20px; /* Set a specific slider handle width */
    height: 20px; /* Set a specific slider handle height */
    border-radius: 50%; /* Circular handle */
    background: #007bff; /* Blue background color */
    cursor: pointer; /* Cursor on hover */
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px; /* Larger font size for better readability */
  }
  button:disabled {
    background-color: #ccc;
  }
  video {
    max-width: 100%;
    margin-top: 20px;
  }
`}</style>
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
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsDataURL(image);
    });
}