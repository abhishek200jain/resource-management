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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

interface Engineer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  availability: boolean;
  currentProject?: string;
}

const Engineers: React.FC = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 5,
      availability: true,
      currentProject: 'Project Alpha',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      skills: ['Python', 'Django', 'PostgreSQL'],
      experience: 3,
      availability: false,
      currentProject: 'Project Beta',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      skills: ['Java', 'Spring Boot', 'MongoDB'],
      experience: 7,
      availability: true,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    availability: true,
    currentProject: '',
  });

  const handleOpen = (engineer?: Engineer) => {
    if (engineer) {
      setEditingEngineer(engineer);
      setFormData({
        name: engineer.name,
        email: engineer.email,
        skills: engineer.skills.join(', '),
        experience: engineer.experience.toString(),
        availability: engineer.availability,
        currentProject: engineer.currentProject || '',
      });
    } else {
      setEditingEngineer(null);
      setFormData({
        name: '',
        email: '',
        skills: '',
        experience: '',
        availability: true,
        currentProject: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEngineer(null);
  };

  const handleSubmit = () => {
    const newEngineer: Engineer = {
      id: editingEngineer?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      skills: formData.skills.split(',').map(skill => skill.trim()),
      experience: parseInt(formData.experience),
      availability: formData.availability,
      currentProject: formData.currentProject || undefined,
    };

    if (editingEngineer) {
      setEngineers(engineers.map(eng => eng.id === editingEngineer.id ? newEngineer : eng));
    } else {
      setEngineers([...engineers, newEngineer]);
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    setEngineers(engineers.filter(eng => eng.id !== id));
  };

  const availableEngineers = engineers.filter(eng => eng.availability).length;
  const totalEngineers = engineers.length;

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
              {(engineers.reduce((sum, eng) => sum + eng.experience, 0) / totalEngineers).toFixed(1)}y
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
              <TableCell>Current Project</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engineers.map((engineer) => (
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
                <TableCell>{engineer.currentProject || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(engineer)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(engineer.id)} size="small" color="error">
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
          {editingEngineer ? 'Edit Engineer' : 'Add New Engineer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Skills (comma-separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              fullWidth
              helperText="Enter skills separated by commas"
            />
            <TextField
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              fullWidth
            />
            <TextField
              label="Current Project (optional)"
              value={formData.currentProject}
              onChange={(e) => setFormData({ ...formData, currentProject: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEngineer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Engineers; 