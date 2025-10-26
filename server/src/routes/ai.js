const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { Project, Task } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/ai/generate-user-stories
router.post('/generate-user-stories', authenticateToken, async (req, res) => {
  try {
    const { projectId, projectDescription } = req.body;

    // Validate input
    if (!projectId || !projectDescription) {
      return res.status(400).json({ message: 'projectId and projectDescription are required' });
    }

    // Fetch the project to ensure it exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Generate user stories using GROQ API
    const prompt = `Generate user stories from the following project description. Each user story should be in the format: "As a [role], I want to [action], so that [benefit]."

Project Description: ${projectDescription}

Provide the user stories as a JSON array of strings.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      return res.status(500).json({ message: 'Failed to generate user stories' });
    }

    // Parse the response as JSON array
    let userStories;
    try {
      // Clean the response content by removing markdown code blocks if present
      let cleanedContent = responseContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Find the first complete JSON array
      const jsonStart = cleanedContent.indexOf('[');
      if (jsonStart === -1) {
        throw new Error('No JSON array found');
      }

      let bracketCount = 0;
      let jsonEnd = jsonStart;
      for (let i = jsonStart; i < cleanedContent.length; i++) {
        if (cleanedContent[i] === '[') {
          bracketCount++;
        } else if (cleanedContent[i] === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            jsonEnd = i;
            break;
          }
        }
      }

      if (bracketCount !== 0) {
        throw new Error('Incomplete JSON array');
      }

      cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1);

      userStories = JSON.parse(cleanedContent);
      if (!Array.isArray(userStories)) {
        throw new Error('Response is not an array');
      }

      // Extract the user story descriptions for task creation
      userStories = userStories.map(story => {
        if (typeof story === 'string') {
          return story;
        } else if (story && typeof story === 'object' && story.description) {
          return story.description;
        } else if (story && typeof story === 'object' && story.userStory) {
          return story.userStory;
        } else {
          throw new Error('Invalid story format');
        }
      });
    } catch (parseError) {
      console.error('Error parsing GROQ response:', parseError);
      console.error('Raw response:', responseContent);
      return res.status(500).json({ message: 'Invalid response format from AI' });
    }

    // Update the project with user stories
    await project.update({ userStories });

    // Optionally create tasks from stories
    const tasks = [];
    for (const story of userStories) {
      const task = await Task.create({
        title: story,
        description: `Generated from user story: ${story}`,
        status: 'To Do',
        projectId: projectId,
      });
      tasks.push(task);
    }

    // Return the user stories
    res.json({ userStories, tasksCreated: tasks.length });
  } catch (err) {
    console.error('Error generating user stories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
