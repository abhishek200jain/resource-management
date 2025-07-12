import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography, Card,
  CardContent, List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';
import { engineerService, type Engineer } from '../services/engineerService';
import { projectService, type Project } from '../services/projectService';
import { assignmentService, type Assignment } from '../services/assignmentService';

const Dashboard: React.FC = () => {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates for all data
  useEffect(() => {
    const unsubscribeEngineers = engineerService.subscribeToEngineers((engineers) => {
      setEngineers(engineers);
    });

    const unsubscribeProjects = projectService.subscribeToProjects((projects) => {
      setProjects(projects);
    });

    const unsubscribeAssignments = assignmentService.subscribeToAssignments((assignments) => {
      setAssignments(assignments);
    });

    // Set loading to false after initial data load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubscribeEngineers();
      unsubscribeProjects();
      unsubscribeAssignments();
      clearTimeout(timer);
    };
  }, []);

  // Calculate dynamic statistics
  const stats = {
    totalEngineers: engineers.length,
    availableEngineers: engineers.filter(eng => eng.availability).length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter(a => a.status === 'Active').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    avgUtilization: assignments.length > 0 
      ? Math.round(assignments.reduce((sum, a) => sum + a.allocation, 0) / assignments.length)
      : 0,
  };

  // Get recent assignments (last 5 active assignments)
  const recentAssignments = assignments
    .filter(a => a.status === 'Active')
    .slice(0, 5);

  // Calculate upcoming deadlines (projects ending within 90 days)
  const upcomingDeadlines = projects
    .filter(p => p.status === 'In Progress' || p.status === 'Planning')
    .map(project => {
      const endDate = new Date(project.endDate);
      const today = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        project: project.name,
        deadline: project.endDate,
        daysLeft: daysLeft,
        status: project.status,
      };
    })
    .filter(deadline => deadline.daysLeft > 0 && deadline.daysLeft <= 90)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  // Calculate projects at risk (ending within 30 days)
  const projectsAtRisk = projects.filter(p => {
    const endDate = new Date(p.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 && daysLeft <= 30 && (p.status === 'In Progress' || p.status === 'Planning');
  }).length;

  // Calculate completed projects this month
  const completedThisMonth = projects.filter(p => {
    if (p.status !== 'Completed') return false;
    const completedDate = new Date(p.updatedAt?.toDate() || p.endDate);
    const today = new Date();
    return completedDate.getMonth() === today.getMonth() && 
           completedDate.getFullYear() === today.getFullYear();
  }).length;

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
            {recentAssignments.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                No active assignments found
              </Typography>
            ) : (
              <List>
                {recentAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {assignment.engineerName.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.engineerName}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {assignment.projectName} • {assignment.role}
                            </Typography>
                            <Chip
                              label={`${assignment.allocation}% allocation`}
                              color="primary"
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
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card sx={{ flex: 1, minWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            {upcomingDeadlines.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                No upcoming deadlines
              </Typography>
            ) : (
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
            )}
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
                {projectsAtRisk}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Completed This Month
              </Typography>
              <Typography variant="h6" color="success.main">
                {completedThisMonth}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
        {/* Engineer Skills Distribution */}
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Skills
            </Typography>
            {engineers.length === 0 ? (
              <Typography color="textSecondary" align="center">
                No engineers found
              </Typography>
            ) : (
              <Box>
                {(() => {
                  const skillCounts: { [key: string]: number } = {};
                  engineers.forEach(engineer => {
                    engineer.skills.forEach(skill => {
                      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    });
                  });
                  
                  const topSkills = Object.entries(skillCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5);
                  
                  return topSkills.map(([skill, count]) => (
                    <Box key={skill} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill}</Typography>
                      <Chip label={count} size="small" />
                    </Box>
                  ));
                })()}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Status
            </Typography>
            {projects.length === 0 ? (
              <Typography color="textSecondary" align="center">
                No projects found
              </Typography>
            ) : (
              <Box>
                {(() => {
                  const statusCounts: { [key: string]: number } = {};
                  projects.forEach(project => {
                    statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
                  });
                  
                  return Object.entries(statusCounts).map(([status, count]) => (
                    <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{status}</Typography>
                      <Chip 
                        label={count} 
                        size="small" 
                        color={getStatusColor(status) as any}
                      />
                    </Box>
                  ));
                })()}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 