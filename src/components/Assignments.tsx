import React, { useState, useEffect } from 'react';
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
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { assignmentService, type Assignment } from '../services/assignmentService';
import { engineerService, type Engineer } from '../services/engineerService';
import { projectService, type Project } from '../services/projectService';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    engineerId: '',
    engineerName: '',
    projectId: '',
    projectName: '',
    role: '',
    startDate: '',
    endDate: '',
    allocation: '',
    status: 'Active' as Assignment['status'],
  });

  // Subscribe to real-time updates for all data
  useEffect(() => {
    const unsubscribeAssignments = assignmentService.subscribeToAssignments((assignments) => {
      setAssignments(assignments);
    });

    const unsubscribeEngineers = engineerService.subscribeToEngineers((engineers) => {
      setEngineers(engineers);
    });

    const unsubscribeProjects = projectService.subscribeToProjects((projects) => {
      setProjects(projects);
    });

    // Set loading to false after initial data load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubscribeAssignments();
      unsubscribeEngineers();
      unsubscribeProjects();
      clearTimeout(timer);
    };
  }, []);

  const handleOpen = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        engineerId: assignment.engineerId,
        engineerName: assignment.engineerName,
        projectId: assignment.projectId,
        projectName: assignment.projectName,
        role: assignment.role,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        allocation: assignment.allocation.toString(),
        status: assignment.status,
      });
    } else {
      setEditingAssignment(null);
      setFormData({
        engineerId: '',
        engineerName: '',
        projectId: '',
        projectName: '',
        role: '',
        startDate: '',
        endDate: '',
        allocation: '',
        status: 'Active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAssignment(null);
    setSubmitting(false);
  };

  const handleEngineerChange = (engineerId: string) => {
    const engineer = engineers.find(eng => eng.id === engineerId);
    setFormData({
      ...formData,
      engineerId,
      engineerName: engineer?.name || '',
    });
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(proj => proj.id === projectId);
    setFormData({
      ...formData,
      projectId,
      projectName: project?.name || '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.engineerId || !formData.projectId || !formData.role || !formData.startDate || !formData.endDate || !formData.allocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const assignmentData = {
        engineerId: formData.engineerId,
        engineerName: formData.engineerName,
        projectId: formData.projectId,
        projectName: formData.projectName,
        role: formData.role,
        startDate: formData.startDate,
        endDate: formData.endDate,
        allocation: parseInt(formData.allocation),
        status: formData.status,
      };

      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.id!, assignmentData);
        toast.success('Assignment updated successfully!');
      } else {
        await assignmentService.addAssignment(assignmentData);
        toast.success('Assignment created successfully!');
      }

      handleClose();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error(editingAssignment ? 'Failed to update assignment' : 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentService.deleteAssignment(id);
        toast.success('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      }
    }
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'default';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const totalAssignments = assignments.length;
  const avgAllocation = assignments.length > 0 
    ? assignments.reduce((sum, a) => sum + a.allocation, 0) / assignments.length 
    : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Assignments
            </Typography>
            <Typography variant="h4">{totalAssignments}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Assignments
            </Typography>
            <Typography variant="h4" color="success.main">
              {activeAssignments}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg Allocation
            </Typography>
            <Typography variant="h4">
              {Math.round(avgAllocation)}%
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Engineers Assigned
            </Typography>
            <Typography variant="h4">
              {new Set(assignments.map(a => a.engineerId)).size}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Assignment List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={engineers.length === 0 || projects.length === 0}
        >
          Create Assignment
        </Button>
      </Box>

      {engineers.length === 0 && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography color="warning.main" align="center">
            No engineers available. Please add engineers first.
          </Typography>
        </Paper>
      )}

      {projects.length === 0 && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography color="warning.main" align="center">
            No projects available. Please add projects first.
          </Typography>
        </Paper>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Engineer</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Allocation</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">No assignments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                        {assignment.engineerName.charAt(0)}
                      </Avatar>
                      {assignment.engineerName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      {assignment.projectName}
                    </Box>
                  </TableCell>
                  <TableCell>{assignment.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${assignment.allocation}%`}
                      color={assignment.allocation === 100 ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={assignment.status}
                      color={getStatusColor(assignment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(assignment)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assignment.id!)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>Engineer</InputLabel>
              <Select
                value={formData.engineerId}
                label="Engineer"
                onChange={(e) => handleEngineerChange(e.target.value)}
              >
                {engineers.map((engineer) => (
                  <MenuItem key={engineer.id} value={engineer.id}>
                    {engineer.name} - {engineer.skills.join(', ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectId}
                label="Project"
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} - {project.status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Allocation (%)"
              type="number"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 1, max: 100 }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Assignment['status'] })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : undefined}
          >
            {submitting ? 'Saving...' : (editingAssignment ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments; 