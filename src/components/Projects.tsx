import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  assignedEngineers: number;
  requiredEngineers: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Project Alpha',
      description: 'E-commerce platform development',
      status: 'In Progress',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      assignedEngineers: 3,
      requiredEngineers: 5,
      priority: 'High',
      budget: 50000,
    },
    {
      id: '2',
      name: 'Project Beta',
      description: 'Mobile app for healthcare',
      status: 'Planning',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      assignedEngineers: 0,
      requiredEngineers: 4,
      priority: 'Critical',
      budget: 75000,
    },
    {
      id: '3',
      name: 'Project Gamma',
      description: 'Data analytics dashboard',
      status: 'Completed',
      startDate: '2023-10-01',
      endDate: '2024-02-28',
      assignedEngineers: 2,
      requiredEngineers: 2,
      priority: 'Medium',
      budget: 30000,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning' as Project['status'],
    startDate: '',
    endDate: '',
    requiredEngineers: '',
    priority: 'Medium' as Project['priority'],
    budget: '',
  });

  const handleOpen = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        requiredEngineers: project.requiredEngineers.toString(),
        priority: project.priority,
        budget: project.budget.toString(),
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'Planning',
        startDate: '',
        endDate: '',
        requiredEngineers: '',
        priority: 'Medium',
        budget: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = () => {
    const newProject: Project = {
      id: editingProject?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      assignedEngineers: editingProject?.assignedEngineers || 0,
      requiredEngineers: parseInt(formData.requiredEngineers),
      priority: formData.priority,
      budget: parseInt(formData.budget),
    };

    if (editingProject) {
      setProjects(projects.map(proj => proj.id === editingProject.id ? newProject : proj));
    } else {
      setProjects([...projects, newProject]);
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Planning': return 'default';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Projects
            </Typography>
            <Typography variant="h4">{totalProjects}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Projects
            </Typography>
            <Typography variant="h4" color="primary.main">
              {activeProjects}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Completed
            </Typography>
            <Typography variant="h4" color="success.main">
              {completedProjects}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Budget
            </Typography>
            <Typography variant="h4">
              ${totalBudget.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Project List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Team Size</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    {project.name}
                  </Box>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.priority}
                    color={getPriorityColor(project.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {project.assignedEngineers}/{project.requiredEngineers}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(project.assignedEngineers / project.requiredEngineers) * 100}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((project.assignedEngineers / project.requiredEngineers) * 100)}%
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>${project.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(project)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              >
                <MenuItem value="Planning">Planning</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Required Engineers"
              type="number"
              value={formData.requiredEngineers}
              onChange={(e) => setFormData({ ...formData, requiredEngineers: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Project['priority'] })}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Budget ($)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProject ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects; 