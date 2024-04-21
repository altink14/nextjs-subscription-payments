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

const VideoGenerationForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [motionBucketId, setMotionBucketId] = useState(127);
    const [condAug, setCondAug] = useState(0.02);
    const [steps, setSteps] = useState(4);
    const [fps, setFps] = useState(10);
    const [seed, setSeed] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);

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
            // Use type assertion to inform TypeScript about the structure of the response
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
            }) as unknown as VideoGenerationResponse; // Type assertion here

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
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} />
                <input type="range" min="1" max="255" value={motionBucketId} onChange={(e) => setMotionBucketId(parseInt(e.target.value, 10))} />
                <input type="number" step="0.01" value={condAug} onChange={(e) => setCondAug(parseFloat(e.target.value))} />
                <input type="number" value={steps} onChange={(e) => setSteps(parseInt(e.target.value, 10))} />
                <input type="number" value={fps} onChange={(e) => setFps(parseInt(e.target.value, 10))} />
                <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Seed (optional)" />
                <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
            </form>
            {videoUrl && <video src={videoUrl} controls />}
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