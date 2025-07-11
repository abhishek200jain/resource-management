import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    totalEngineers: 15,
    availableEngineers: 8,
    totalProjects: 12,
    activeProjects: 7,
    totalAssignments: 25,
    activeAssignments: 18,
    totalBudget: 450000,
    avgUtilization: 78,
  };

  const recentAssignments = [
    {
      id: '1',
      engineer: 'John Doe',
      project: 'Project Alpha',
      role: 'Frontend Developer',
      status: 'Active',
    },
    {
      id: '2',
      engineer: 'Jane Smith',
      project: 'Project Beta',
      role: 'Backend Developer',
      status: 'Active',
    },
    {
      id: '3',
      engineer: 'Mike Johnson',
      project: 'Project Gamma',
      role: 'Full Stack Developer',
      status: 'Completed',
    },
  ];

  const upcomingDeadlines = [
    {
      project: 'Project Alpha',
      deadline: '2024-06-30',
      daysLeft: 45,
    },
    {
      project: 'Project Beta',
      deadline: '2024-08-31',
      daysLeft: 120,
    },
    {
      project: 'Project Delta',
      deadline: '2024-05-15',
      daysLeft: 20,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'default';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (daysLeft: number) => {
    if (daysLeft <= 30) return 'error';
    if (daysLeft <= 60) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography color="textSecondary">
                Engineers
              </Typography>
            </Box>
            <Typography variant="h4">{stats.totalEngineers}</Typography>
            <Typography variant="body2" color="success.main">
              {stats.availableEngineers} available
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography color="textSecondary">
                Projects
              </Typography>
            </Box>
            <Typography variant="h4">{stats.totalProjects}</Typography>
            <Typography variant="body2" color="primary.main">
              {stats.activeProjects} active
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography color="textSecondary">
                Assignments
              </Typography>
            </Box>
            <Typography variant="h4">{stats.totalAssignments}</Typography>
            <Typography variant="body2" color="success.main">
              {stats.activeAssignments} active
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography color="textSecondary">
                Utilization
              </Typography>
            </Box>
            <Typography variant="h4">{stats.avgUtilization}%</Typography>
            <Typography variant="body2" color="textSecondary">
              Average
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Recent Assignments */}
        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Assignments
            </Typography>
            <List>
              {recentAssignments.map((assignment, index) => (
                <React.Fragment key={assignment.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {assignment.engineer.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.engineer}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {assignment.project} • {assignment.role}
                          </Typography>
                          <Chip
                            label={assignment.status}
                            color={getStatusColor(assignment.status)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentAssignments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List>
              {upcomingDeadlines.map((deadline, index) => (
                <React.Fragment key={deadline.project}>
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon 
                        color={getPriorityColor(deadline.daysLeft) as any}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={deadline.project}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Due: {new Date(deadline.deadline).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={`${deadline.daysLeft} days left`}
                            color={getPriorityColor(deadline.daysLeft)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < upcomingDeadlines.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Stats */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Statistics
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Total Budget
              </Typography>
              <Typography variant="h6">
                ${stats.totalBudget.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Resource Utilization
              </Typography>
              <Typography variant="h6">
                {stats.avgUtilization}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Projects at Risk
              </Typography>
              <Typography variant="h6" color="warning.main">
                2
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Completed This Month
              </Typography>
              <Typography variant="h6" color="success.main">
                3
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 