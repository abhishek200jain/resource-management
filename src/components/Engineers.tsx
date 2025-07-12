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
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { engineerService, type Engineer } from '../services/engineerService';

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    availability: true,
    currentProjects: '',
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = engineerService.subscribeToEngineers((engineers) => {
      setEngineers(engineers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpen = (engineer?: Engineer) => {
    if (engineer) {
      setEditingEngineer(engineer);
      setFormData({
        name: engineer.name,
        email: engineer.email,
        skills: engineer.skills.join(', '),
        experience: engineer.experience.toString(),
        availability: engineer.availability,
        currentProjects: engineer.currentProjects?.join(', ') || '',
      });
    } else {
      setEditingEngineer(null);
      setFormData({
        name: '',
        email: '',
        skills: '',
        experience: '',
        availability: true,
        currentProjects: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEngineer(null);
    setSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.skills || !formData.experience) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const engineerData = {
        name: formData.name,
        email: formData.email,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        experience: parseInt(formData.experience),
        availability: formData.availability,
        currentProjects: formData.currentProjects 
          ? formData.currentProjects.split(',').map(project => project.trim()).filter(project => project)
          : [],
      };

      if (editingEngineer) {
        await engineerService.updateEngineer(editingEngineer.id!, engineerData);
        toast.success('Engineer updated successfully!');
      } else {
        await engineerService.addEngineer(engineerData);
        toast.success('Engineer added successfully!');
      }

      handleClose();
    } catch (error) {
      console.error('Error saving engineer:', error);
      toast.error(editingEngineer ? 'Failed to update engineer' : 'Failed to add engineer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this engineer?')) {
      try {
        await engineerService.deleteEngineer(id);
        toast.success('Engineer deleted successfully!');
      } catch (error) {
        console.error('Error deleting engineer:', error);
        toast.error('Failed to delete engineer');
      }
    }
  };

  const availableEngineers = engineers.filter(eng => eng.availability).length;
  const totalEngineers = engineers.length;

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
        Engineers
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Engineers
            </Typography>
            <Typography variant="h4">{totalEngineers}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Available
            </Typography>
            <Typography variant="h4" color="success.main">
              {availableEngineers}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Assigned
            </Typography>
            <Typography variant="h4" color="warning.main">
              {totalEngineers - availableEngineers}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Avg Experience
            </Typography>
            <Typography variant="h4">
              {totalEngineers > 0 
                ? (engineers.reduce((sum, eng) => sum + eng.experience, 0) / totalEngineers).toFixed(1)
                : '0'
              }y
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Engineer List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Engineer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Projects</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engineers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">No engineers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              engineers.map((engineer) => (
                <TableRow key={engineer.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      {engineer.name}
                    </Box>
                  </TableCell>
                  <TableCell>{engineer.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {engineer.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{engineer.experience} years</TableCell>
                  <TableCell>
                    <Chip
                      label={engineer.availability ? 'Available' : 'Assigned'}
                      color={engineer.availability ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {engineer.currentProjects && engineer.currentProjects.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {engineer.currentProjects.map((project, index) => (
                          <Chip key={index} label={project} size="small" variant="outlined" />
                        ))}
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(engineer)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(engineer.id!)} size="small" color="error">
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
          {editingEngineer ? 'Edit Engineer' : 'Add New Engineer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Skills (comma-separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              fullWidth
              required
              helperText="Enter skills separated by commas"
            />
            <TextField
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Current Projects (comma-separated, optional)"
              value={formData.currentProjects}
              onChange={(e) => setFormData({ ...formData, currentProjects: e.target.value })}
              fullWidth
              helperText="Enter project names separated by commas"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                />
              }
              label="Available for new assignments"
            />
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
            {submitting ? 'Saving...' : (editingEngineer ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Engineers; 