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
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface Assignment {
  id: string;
  engineerId: string;
  engineerName: string;
  projectId: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate: string;
  allocation: number; // percentage
  status: 'Active' | 'Completed' | 'On Hold';
}

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      engineerId: '1',
      engineerName: 'John Doe',
      projectId: '1',
      projectName: 'Project Alpha',
      role: 'Frontend Developer',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      allocation: 100,
      status: 'Active',
    },
    {
      id: '2',
      engineerId: '2',
      engineerName: 'Jane Smith',
      projectId: '1',
      projectName: 'Project Alpha',
      role: 'Backend Developer',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      allocation: 80,
      status: 'Active',
    },
    {
      id: '3',
      engineerId: '3',
      engineerName: 'Mike Johnson',
      projectId: '3',
      projectName: 'Project Gamma',
      role: 'Full Stack Developer',
      startDate: '2023-10-01',
      endDate: '2024-02-28',
      allocation: 100,
      status: 'Completed',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
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

  // Mock data for engineers and projects
  const engineers = [
    { id: '1', name: 'John Doe', skills: ['React', 'TypeScript'] },
    { id: '2', name: 'Jane Smith', skills: ['Python', 'Django'] },
    { id: '3', name: 'Mike Johnson', skills: ['Java', 'Spring'] },
  ];

  const projects = [
    { id: '1', name: 'Project Alpha', status: 'In Progress' },
    { id: '2', name: 'Project Beta', status: 'Planning' },
    { id: '3', name: 'Project Gamma', status: 'Completed' },
  ];

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

  const handleSubmit = () => {
    const newAssignment: Assignment = {
      id: editingAssignment?.id || Date.now().toString(),
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
      setAssignments(assignments.map(assign => assign.id === editingAssignment.id ? newAssignment : assign));
    } else {
      setAssignments([...assignments, newAssignment]);
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter(assign => assign.id !== id));
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
        >
          Create Assignment
        </Button>
      </Box>

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
            {assignments.map((assignment) => (
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
                  <IconButton onClick={() => handleDelete(assignment.id)} size="small" color="error">
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
          {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Engineer</InputLabel>
              <Select
                value={formData.engineerId}
                label="Engineer"
                onChange={(e) => handleEngineerChange(e.target.value)}
              >
                {engineers.map((engineer) => (
                  <MenuItem key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectId}
                label="Project"
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
            />
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
              label="Allocation (%)"
              type="number"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
              fullWidth
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAssignment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assignments; 