const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// In-memory storage for video jobs
let videoJobs = new Map();

// Routes

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Video Generator API is running',
    timestamp: new Date().toISOString()
  });
});

// Generate video endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, quality, style, duration, email } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Video prompt is required'
      });
    }

    const jobId = uuidv4();
    const job = {
      jobId,
      prompt,
      quality: quality || '4k',
      style: style || 'cinematic',
      duration: duration || '30s',
      email: email || null,
      status: 'processing',
      createdAt: new Date().toISOString(),
      progress: 0
    };

    videoJobs.set(jobId, job);

    // Simulate video generation process
    simulateVideoGeneration(jobId);

    res.json({
      success: true,
      jobId,
      status: 'processing',
      message: 'Video generation started successfully!',
      estimatedTime: '30-60 seconds'
    });

  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Check job status
app.get('/api/job/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = videoJobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      error: 'Job not found'
    });
  }

  res.json(job);
});

// Get all prompts
app.get('/api/prompts', (req, res) => {
  const prompts = [
    {
      id: 1,
      title: "Futuristic City",
      prompt: "A cinematic shot of a futuristic city at sunset with flying vehicles and neon lights, hyper-realistic, 8K resolution, cinematic lighting, detailed architecture",
      category: "cityscape"
    },
    {
      id: 2,
      title: "Seasonal Forest",
      prompt: "An artistic time-lapse of a forest changing through the four seasons, cinematic, hyper-detailed, atmospheric lighting, nature documentary style",
      category: "nature"
    },
    {
      id: 3,
      title: "Underwater World",
      prompt: "A realistic underwater scene with diverse marine life and coral reefs, cinematic wide shot, crystal clear water, vibrant colors, documentary style",
      category: "underwater"
    },
    {
      id: 4,
      title: "Mountain Majesty",
      prompt: "A cinematic drone shot flying over majestic mountain ranges at golden hour, hyper-realistic, 4K resolution, volumetric clouds, epic scale",
      category: "landscape"
    },
    {
      id: 5,
      title: "Medieval Market",
      prompt: "An artistic depiction of a bustling medieval market street with detailed costumes and architecture, cinematic lighting, realistic textures, historical accuracy",
      category: "historical"
    }
  ];

  res.json(prompts);
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required'
      });
    }

    // In a real app, you would save this to a database and send an email
    console.log('Contact form submission:', { name, email, message });

    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      error: 'Failed to process contact form'
    });
  }
});

// Simulate video generation
function simulateVideoGeneration(jobId) {
  let progress = 0;
 
  const interval = setInterval(() => {
    progress += Math.random() * 20;
   
    const job = videoJobs.get(jobId);
    if (job) {
      if (progress >= 100) {
        // Mark as completed
        videoJobs.set(jobId, {
          ...job,
          status: 'completed',
          progress: 100,
          videoUrl: 'https://example.com/video/demo.mp4', // Demo URL
          completedAt: new Date().toISOString()
        });
        clearInterval(interval);
      } else {
        // Update progress
        videoJobs.set(jobId, {
          ...job,
          progress: Math.min(progress, 99)
        });
      }
    } else {
      clearInterval(interval);
    }
  }, 2000);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving frontend from: ${path.join(__dirname, '../public')}`);
});
