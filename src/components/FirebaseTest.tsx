import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { engineerService } from '../services/engineerService';
import { projectService } from '../services/projectService';
import { assignmentService } from '../services/assignmentService';
import { toast } from 'react-toastify';

const FirebaseTest: React.FC = () => {
  const [loadingEngineers, setLoadingEngineers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const addSampleEngineers = async () => {
    setLoadingEngineers(true);
    try {
      const sampleEngineers = [
        {
          name: 'John Doe',
          email: 'john.doe@company.com',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience: 5,
          availability: true,
          currentProjects: ['Project Alpha'],
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          skills: ['Python', 'Django', 'PostgreSQL'],
          experience: 3,
          availability: false,
          currentProjects: ['Project Beta'],
        },
        {
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          skills: ['Java', 'Spring Boot', 'MongoDB'],
          experience: 7,
          availability: true,
          currentProjects: [],
        },
      ];

      for (const engineer of sampleEngineers) {
        await engineerService.addEngineer(engineer);
      }

      toast.success('Sample engineers added successfully!');
    } catch (error) {
      console.error('Error adding sample engineers:', error);
      toast.error('Failed to add sample engineers');
    } finally {
      setLoadingEngineers(false);
    }
  };

  const addSampleProjects = async () => {
    setLoadingProjects(true);
    try {
      const sampleProjects = [
        {
          name: 'Project Alpha',
          description: 'E-commerce platform development',
          status: 'In Progress' as const,
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          assignedEngineers: 3,
          requiredEngineers: 5,
          priority: 'High' as const,
          budget: 50000,
        },
        {
          name: 'Project Beta',
          description: 'Mobile app for healthcare',
          status: 'Planning' as const,
          startDate: '2024-03-01',
          endDate: '2024-08-31',
          assignedEngineers: 0,
          requiredEngineers: 4,
          priority: 'Critical' as const,
          budget: 75000,
        },
        {
          name: 'Project Gamma',
          description: 'Data analytics dashboard',
          status: 'Completed' as const,
          startDate: '2023-10-01',
          endDate: '2024-02-28',
          assignedEngineers: 2,
          requiredEngineers: 2,
          priority: 'Medium' as const,
          budget: 30000,
        },
      ];

      for (const project of sampleProjects) {
        await projectService.addProject(project);
      }

      toast.success('Sample projects added successfully!');
    } catch (error) {
      console.error('Error adding sample projects:', error);
      toast.error('Failed to add sample projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const addSampleAssignments = async () => {
    setLoadingAssignments(true);
    try {
      // First, get existing engineers and projects to create realistic assignments
      const engineersSnapshot = await engineerService.subscribeToEngineers(() => {});
      const projectsSnapshot = await projectService.subscribeToProjects(() => {});
      
      // For demo purposes, we'll create assignments with hardcoded data
      // In a real app, you'd get the actual IDs from the database
      const sampleAssignments = [
        {
          engineerId: 'demo-engineer-1',
          engineerName: 'John Doe',
          projectId: 'demo-project-1',
          projectName: 'Project Alpha',
          role: 'Frontend Developer',
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          allocation: 100,
          status: 'Active' as const,
        },
        {
          engineerId: 'demo-engineer-2',
          engineerName: 'Jane Smith',
          projectId: 'demo-project-1',
          projectName: 'Project Alpha',
          role: 'Backend Developer',
          startDate: '2024-01-15',
          endDate: '2024-06-30',
          allocation: 80,
          status: 'Active' as const,
        },
        {
          engineerId: 'demo-engineer-3',
          engineerName: 'Mike Johnson',
          projectId: 'demo-project-3',
          projectName: 'Project Gamma',
          role: 'Full Stack Developer',
          startDate: '2023-10-01',
          endDate: '2024-02-28',
          allocation: 100,
          status: 'Completed' as const,
        },
      ];

      for (const assignment of sampleAssignments) {
        await assignmentService.addAssignment(assignment);
      }

      toast.success('Sample assignments added successfully!');
    } catch (error) {
      console.error('Error adding sample assignments:', error);
      toast.error('Failed to add sample assignments');
    } finally {
      setLoadingAssignments(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Firebase Test
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Engineer CRUD Operations Test
        </Typography>
        <Button
          variant="contained"
          onClick={addSampleEngineers}
          disabled={loadingEngineers}
        >
          {loadingEngineers ? 'Adding...' : 'Add Sample Engineers'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Project CRUD Operations Test
        </Typography>
        <Button
          variant="contained"
          onClick={addSampleProjects}
          disabled={loadingProjects}
        >
          {loadingProjects ? 'Adding...' : 'Add Sample Projects'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Assignment CRUD Operations Test
        </Typography>
        <Button
          variant="contained"
          onClick={addSampleAssignments}
          disabled={loadingAssignments}
        >
          {loadingAssignments ? 'Adding...' : 'Add Sample Assignments'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography paragraph>
          1. Click "Add Sample Engineers" to populate the database with sample engineer data
        </Typography>
        <Typography paragraph>
          2. Click "Add Sample Projects" to populate the database with sample project data
        </Typography>
        <Typography paragraph>
          3. Click "Add Sample Assignments" to populate the database with sample assignment data
        </Typography>
        <Typography paragraph>
          4. Navigate to the Engineers, Projects, and Assignments pages to see the real-time CRUD operations
        </Typography>
        <Typography paragraph>
          5. Try adding, editing, and deleting engineers, projects, and assignments to test the functionality
        </Typography>
      </Paper>
    </Box>
  );
};

export default FirebaseTest; 